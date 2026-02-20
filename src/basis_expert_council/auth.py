"""
BasisPilot (贝领) — 认证模块
支持微信 H5 OAuth 和 Supabase JWT 两种认证方式
"""

import os
import time
from typing import Any

import httpx
import jwt

from . import db

# ---------------------------------------------------------------------------
# 配置
# ---------------------------------------------------------------------------

WECHAT_APP_ID = os.getenv("WECHAT_APP_ID", "")
WECHAT_APP_SECRET = os.getenv("WECHAT_APP_SECRET", "")

# JWT 配置（自签发，用于 API 认证）
JWT_SECRET = os.getenv("BASIS_JWT_SECRET", "basis-expert-council-secret-change-me")
JWT_ALGORITHM = "HS256"
JWT_EXPIRY_SECONDS = 7 * 24 * 3600  # 7 天

# Supabase JWT 公钥验证
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "")

# ---------------------------------------------------------------------------
# JWT 签发与验证
# ---------------------------------------------------------------------------


def create_token(user_id: int, plan: str = "free", extra: dict | None = None) -> str:
    """签发 JWT token"""
    now = int(time.time())
    payload = {
        "sub": str(user_id),
        "plan": plan,
        "iat": now,
        "exp": now + JWT_EXPIRY_SECONDS,
    }
    if extra:
        payload.update(extra)
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def verify_token(token: str) -> dict | None:
    """验证自签发的 JWT token，返回 payload 或 None"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def verify_supabase_token(token: str) -> dict | None:
    """验证 Supabase JWT（如果配置了密钥）"""
    if not SUPABASE_JWT_SECRET:
        return None
    try:
        payload = jwt.decode(
            token,
            SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            audience="authenticated",
        )
        return payload
    except jwt.InvalidTokenError:
        return None


# ---------------------------------------------------------------------------
# 微信 H5 OAuth
# ---------------------------------------------------------------------------

WECHAT_OAUTH_URL = "https://open.weixin.qq.com/connect/oauth2/authorize"
WECHAT_TOKEN_URL = "https://api.weixin.qq.com/sns/oauth2/access_token"
WECHAT_USERINFO_URL = "https://api.weixin.qq.com/sns/userinfo"


def get_wechat_auth_url(redirect_uri: str, state: str = "") -> str:
    """生成微信 H5 OAuth 授权链接（scope=snsapi_userinfo 获取用户信息）"""
    params = {
        "appid": WECHAT_APP_ID,
        "redirect_uri": redirect_uri,
        "response_type": "code",
        "scope": "snsapi_userinfo",
        "state": state,
    }
    query = "&".join(f"{k}={v}" for k, v in params.items())
    return f"{WECHAT_OAUTH_URL}?{query}#wechat_redirect"


async def wechat_code_to_token(code: str) -> dict[str, Any]:
    """用微信 authorization code 换取 access_token + openid"""
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            WECHAT_TOKEN_URL,
            params={
                "appid": WECHAT_APP_ID,
                "secret": WECHAT_APP_SECRET,
                "code": code,
                "grant_type": "authorization_code",
            },
        )
        data = resp.json()
        if "errcode" in data and data["errcode"] != 0:
            raise ValueError(f"WeChat token error: {data.get('errmsg', 'unknown')}")
        return data


async def get_wechat_userinfo(access_token: str, openid: str) -> dict[str, Any]:
    """获取微信用户信息"""
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            WECHAT_USERINFO_URL,
            params={"access_token": access_token, "openid": openid, "lang": "zh_CN"},
        )
        data = resp.json()
        if "errcode" in data and data["errcode"] != 0:
            raise ValueError(f"WeChat userinfo error: {data.get('errmsg', 'unknown')}")
        return data


async def wechat_login(code: str) -> dict[str, Any]:
    """
    完整微信 H5 登录流程:
    1. code → access_token + openid
    2. 获取用户信息
    3. 创建或更新业务用户
    4. 签发 JWT
    """
    # Step 1: code → token
    token_data = await wechat_code_to_token(code)
    access_token = token_data["access_token"]
    openid = token_data["openid"]
    unionid = token_data.get("unionid")

    # Step 2: 获取用户信息
    try:
        userinfo = await get_wechat_userinfo(access_token, openid)
        nickname = userinfo.get("nickname")
        avatar_url = userinfo.get("headimgurl")
    except Exception:
        nickname = None
        avatar_url = None

    # Step 3: 创建或更新用户
    user = await db.upsert_user_by_wechat(
        openid=openid,
        unionid=unionid,
        nickname=nickname,
        avatar_url=avatar_url,
    )

    # Step 4: 获取 plan 并签发 token
    plan = await db.get_user_plan(user["id"])
    token = create_token(user["id"], plan)

    return {
        "token": token,
        "user": {
            "id": user["id"],
            "nickname": user.get("nickname") or "微信用户",
            "avatar_url": user.get("avatar_url"),
            "plan": plan,
        },
    }


# ---------------------------------------------------------------------------
# Supabase 用户同步
# ---------------------------------------------------------------------------


async def sync_supabase_user(supabase_uid: str, phone: str | None = None) -> dict[str, Any]:
    """
    Supabase 登录后同步业务用户:
    - 已存在则返回
    - 不存在则创建
    - 签发 JWT
    """
    user = await db.get_user_by_supabase_uid(supabase_uid)
    if not user:
        user = await db.create_user(supabase_uid=supabase_uid, phone=phone)

    plan = await db.get_user_plan(user["id"])
    token = create_token(user["id"], plan)

    return {
        "token": token,
        "user": {
            "id": user["id"],
            "nickname": user.get("nickname") or user.get("phone") or "用户",
            "avatar_url": user.get("avatar_url"),
            "plan": plan,
        },
    }


# ---------------------------------------------------------------------------
# 统一认证入口（从 HTTP header 解析用户）
# ---------------------------------------------------------------------------


async def authenticate_request(headers: dict) -> dict | None:
    """
    从 HTTP headers 解析认证信息，返回用户信息或 None。
    支持:
    - Authorization: Bearer <basis-jwt>
    - Authorization: Bearer <supabase-jwt>
    """
    auth_header = headers.get("authorization", "")
    if not auth_header.startswith("Bearer "):
        return None

    token = auth_header[7:]

    # 1. 尝试自签发 JWT
    payload = verify_token(token)
    if payload:
        user_id = int(payload["sub"])
        user = await db.get_user_by_id(user_id)
        if user:
            plan = await db.get_user_plan(user_id)
            return {"user_id": user_id, "plan": plan, "auth_type": "basis"}

    # 2. 尝试 Supabase JWT
    payload = verify_supabase_token(token)
    if payload:
        supabase_uid = payload.get("sub")
        if supabase_uid:
            result = await sync_supabase_user(supabase_uid)
            return {
                "user_id": result["user"]["id"],
                "plan": result["user"]["plan"],
                "auth_type": "supabase",
            }

    return None
