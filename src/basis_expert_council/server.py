"""
BasisPilot (贝领) — 业务 API 服务
独立 FastAPI 应用，处理认证、用户管理、配额、定价等业务逻辑。
与 LangGraph Agent 服务并行运行。

启动: uvicorn src.basis_expert_council.server:app --host 0.0.0.0 --port 5096
"""

import logging
import os
from contextlib import asynccontextmanager

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

load_dotenv()

from . import db
from .auth import (
    WECHAT_APP_ID,
    authenticate_request,
    create_token,
    get_wechat_auth_url,
    sync_supabase_user,
    wechat_login,
)

logger = logging.getLogger("basis.server")

# LangGraph Agent URL (for proxied calls)
LANGGRAPH_URL = os.getenv("LANGGRAPH_URL", "http://localhost:5095")


# ---------------------------------------------------------------------------
# Lifespan
# ---------------------------------------------------------------------------


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: init DB schema. Shutdown: close pool."""
    try:
        await db.init_schema()
        logger.info("Business database schema initialized")
    except Exception as e:
        logger.warning(f"Schema init: {e}")
    yield
    await db.close_pool()


# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------

app = FastAPI(
    title="BasisPilot API",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS — allow frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:8015",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8015",
        os.getenv("FRONTEND_URL", ""),
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Quota-Plan", "X-Quota-Daily-Limit", "X-Quota-Used", "X-Quota-Remaining"],
)


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------


@app.get("/ok")
async def health():
    return {"status": "ok", "service": "basis-api"}


# ---------------------------------------------------------------------------
# Auth: 微信 OAuth
# ---------------------------------------------------------------------------


@app.get("/api/auth/wechat/url")
async def wechat_auth_url(redirect_uri: str, state: str = ""):
    """获取微信 H5 授权 URL"""
    if not WECHAT_APP_ID:
        return JSONResponse(status_code=501, content={"error": "微信登录未配置"})
    url = get_wechat_auth_url(redirect_uri, state)
    return {"auth_url": url}


@app.get("/api/auth/wechat/callback")
async def wechat_callback(code: str):
    """微信 OAuth 回调：code → token"""
    try:
        result = await wechat_login(code)
        return result
    except Exception as e:
        logger.error(f"WeChat login failed: {e}")
        return JSONResponse(status_code=400, content={"error": "微信登录失败"})


# ---------------------------------------------------------------------------
# Auth: Supabase 同步
# ---------------------------------------------------------------------------


@app.post("/api/auth/sync")
async def sync_user(request: Request):
    """Supabase 登录后同步业务用户，签发 BASIS JWT"""
    try:
        body = await request.json()
        supabase_uid = body.get("supabase_uid")
        phone = body.get("phone")
        if not supabase_uid:
            return JSONResponse(status_code=400, content={"error": "缺少 supabase_uid"})
        result = await sync_supabase_user(supabase_uid, phone)
        return result
    except Exception as e:
        logger.error(f"User sync failed: {e}")
        return JSONResponse(status_code=500, content={"error": "用户同步失败"})


# ---------------------------------------------------------------------------
# User
# ---------------------------------------------------------------------------


@app.get("/api/user/me")
async def get_me(request: Request):
    """获取当前用户信息 + 配额"""
    auth_info = await authenticate_request(dict(request.headers))
    if not auth_info:
        return JSONResponse(status_code=401, content={"error": "未登录"})

    user = await db.get_user_by_id(auth_info["user_id"])
    if not user:
        return JSONResponse(status_code=404, content={"error": "用户不存在"})

    quota = await db.check_quota(auth_info["user_id"])
    sub = await db.get_active_subscription(auth_info["user_id"])

    return {
        "user": {
            "id": user["id"],
            "nickname": user.get("nickname") or user.get("phone") or "用户",
            "avatar_url": user.get("avatar_url"),
            "phone": user.get("phone"),
        },
        "subscription": {
            "plan": sub["plan"] if sub else "free",
            "status": sub["status"] if sub else "active",
            "expires_at": sub["expires_at"].isoformat() if sub and sub.get("expires_at") else None,
        },
        "quota": quota,
    }


@app.get("/api/user/usage")
async def get_usage(request: Request):
    """获取今日用量"""
    auth_info = await authenticate_request(dict(request.headers))
    if not auth_info:
        return JSONResponse(status_code=401, content={"error": "未登录"})

    usage = await db.get_daily_usage(auth_info["user_id"])
    quota = await db.check_quota(auth_info["user_id"])
    return {"usage": usage, "quota": quota}


# ---------------------------------------------------------------------------
# Quota check (called by frontend before sending chat)
# ---------------------------------------------------------------------------


@app.post("/api/quota/check")
async def check_quota(request: Request):
    """检查配额是否足够，并记录一次用量"""
    auth_info = await authenticate_request(dict(request.headers))
    if not auth_info:
        return JSONResponse(status_code=401, content={"error": "未登录"})

    quota = await db.check_quota(auth_info["user_id"])
    if not quota["allowed"]:
        return JSONResponse(
            status_code=429,
            content={
                "error": "今日对话次数已用完，请升级会员或明日再来",
                "code": "QUOTA_EXCEEDED",
                **quota,
            },
        )

    # Record usage
    await db.increment_usage(auth_info["user_id"])

    return {"allowed": True, **quota}


# ---------------------------------------------------------------------------
# Pricing (public)
# ---------------------------------------------------------------------------


@app.get("/api/pricing")
async def get_pricing():
    """返回会员定价信息"""
    return {
        "plans": [
            {
                "tier": "free",
                "name": "免费试用",
                "monthly_price": 0,
                "yearly_price": 0,
                "daily_messages": 5,
                "subjects": "数学+科学",
                "reports": "无",
                "features": ["每日5次对话", "数学+科学两科", "基础答疑"],
            },
            {
                "tier": "basic",
                "name": "基础会员",
                "monthly_price": 29900,
                "yearly_price": 268800,
                "daily_messages": 50,
                "subjects": "全科",
                "reports": "1次评估",
                "features": ["每日50次对话", "全科覆盖", "1次学术评估", "历史对话记录"],
            },
            {
                "tier": "premium",
                "name": "高级会员",
                "monthly_price": 69900,
                "yearly_price": 628800,
                "daily_messages": -1,
                "subjects": "全科+规划",
                "reports": "学期报告",
                "features": ["无限对话", "全科+升学规划", "学期评估报告", "AP选课建议"],
            },
            {
                "tier": "vip",
                "name": "VIP 会员",
                "monthly_price": 199900,
                "yearly_price": 1888800,
                "daily_messages": -1,
                "subjects": "全科+规划+人工",
                "reports": "月度报告",
                "features": [
                    "无限对话+优先响应",
                    "全科+升学规划",
                    "月度评估报告",
                    "专家人工审核",
                    "1对1答疑",
                ],
            },
        ],
        "addons": [
            {"type": "onboarding_2w", "name": "新生衔接营 2周", "price": 199900},
            {"type": "onboarding_4w", "name": "新生衔接营 4周", "price": 349900},
            {"type": "ap_single", "name": "AP冲刺包 单科", "price": 99900},
            {"type": "ap_bundle", "name": "AP冲刺包 3科套餐", "price": 249900},
            {"type": "assessment", "name": "学术评估报告", "price": 49900},
            {"type": "planning", "name": "升学规划报告", "price": 299900},
        ],
    }


# ---------------------------------------------------------------------------
# CLI entry
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("BASIS_API_PORT", "5096"))
    uvicorn.run("src.basis_expert_council.server:app", host="0.0.0.0", port=port, reload=True)
