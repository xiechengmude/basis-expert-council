"""
BasisPilot (贝领) — 业务 API 服务
独立 FastAPI 应用，处理认证、用户管理、配额、定价等业务逻辑。
与 LangGraph Agent 服务并行运行。

启动: uvicorn src.basis_expert_council.server:app --host 0.0.0.0 --port 5096
"""

import logging
import os
import re
import secrets
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
from .sms import RateLimitError, SmsError, send_code, verify_code

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
# Auth: SMS 验证码
# ---------------------------------------------------------------------------

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")


@app.post("/api/auth/send-code")
async def send_sms_code(request: Request):
    """发送短信验证码"""
    try:
        body = await request.json()
        phone = body.get("phone", "")
        if not phone or not re.match(r"^1\d{10}$", phone):
            return JSONResponse(status_code=400, content={"error": "请输入有效的 11 位手机号"})

        await send_code(phone)
        return {"success": True, "expiresIn": 300}

    except RateLimitError as e:
        return JSONResponse(status_code=429, content={"error": str(e)})
    except SmsError as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
    except Exception as e:
        logger.error(f"send-code error: {e}")
        return JSONResponse(status_code=500, content={"error": "发送验证码失败"})


@app.post("/api/auth/phone-login")
async def phone_login(request: Request):
    """短信验证码登录：验证码 → Supabase 用户 → session tokens"""
    try:
        body = await request.json()
        phone = body.get("phone", "")
        code = body.get("code", "")

        if not phone or not code:
            return JSONResponse(status_code=400, content={"error": "手机号和验证码不能为空"})

        if not verify_code(phone, code):
            return JSONResponse(status_code=400, content={"error": "验证码无效或已过期"})

        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            return JSONResponse(status_code=500, content={"error": "Supabase 未配置"})

        email = f"{phone}@sms.basis.edu"
        password = secrets.token_urlsafe(24) + "Aa1!"
        headers = {
            "apikey": SUPABASE_SERVICE_ROLE_KEY,
            "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
            "Content-Type": "application/json",
        }

        async with httpx.AsyncClient(timeout=15) as client:
            # 1. Try to create user
            create_resp = await client.post(
                f"{SUPABASE_URL}/auth/v1/admin/users",
                headers=headers,
                json={
                    "email": email,
                    "password": password,
                    "phone": phone,
                    "phone_confirm": True,
                    "email_confirm": True,
                    "user_metadata": {"phone": phone, "phone_verified_by": "backend_sms"},
                },
            )

            user_id: str | None = None
            is_new_user = True

            if create_resp.status_code in (200, 201):
                user_id = create_resp.json().get("id")
            else:
                # User already exists — find by listing
                is_new_user = False
                list_resp = await client.get(
                    f"{SUPABASE_URL}/auth/v1/admin/users",
                    headers=headers,
                    params={"per_page": "50"},
                )
                if list_resp.status_code == 200:
                    users = list_resp.json().get("users", [])
                    for u in users:
                        if u.get("phone") == phone or u.get("email") == email:
                            user_id = u["id"]
                            break

                if not user_id:
                    return JSONResponse(status_code=500, content={"error": "用户创建失败，请重试"})

                # Update password
                await client.put(
                    f"{SUPABASE_URL}/auth/v1/admin/users/{user_id}",
                    headers=headers,
                    json={"password": password},
                )

            # 2. Sign in to get session
            anon_key = SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY
            sign_in_resp = await client.post(
                f"{SUPABASE_URL}/auth/v1/token?grant_type=password",
                headers={
                    "apikey": anon_key,
                    "Content-Type": "application/json",
                },
                json={"email": email, "password": password},
            )

            if sign_in_resp.status_code != 200:
                logger.error(f"Supabase sign-in failed: {sign_in_resp.text}")
                return JSONResponse(status_code=500, content={"error": "登录失败，请重试"})

            session = sign_in_resp.json()
            return {
                "success": True,
                "accessToken": session.get("access_token"),
                "refreshToken": session.get("refresh_token"),
                "userId": user_id,
                "isNewUser": is_new_user,
            }

    except Exception as e:
        logger.error(f"phone-login error: {e}")
        return JSONResponse(status_code=500, content={"error": "登录失败"})


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

    # 构造基础用户信息
    user_info = {
        "id": user["id"],
        "nickname": user.get("nickname") or user.get("phone") or "用户",
        "avatar_url": user.get("avatar_url"),
        "phone": user.get("phone"),
        "role": user.get("role", "student"),
    }

    # 学生画像
    profile = None
    if user.get("role") == "student":
        profile = await db.get_student_profile(user["id"])

    # 家长绑定的学生列表
    linked_students = None
    if user.get("role") == "parent":
        linked_students = await db.get_linked_students(user["id"])

    return {
        "user": user_info,
        "kyc_completed": bool(user.get("kyc_completed", False)),
        "student_profile": profile,
        "linked_students": linked_students,
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
# KYC
# ---------------------------------------------------------------------------


@app.post("/api/user/complete-kyc")
async def complete_kyc_endpoint(request: Request):
    """标记用户 KYC 已完成"""
    auth_info = await authenticate_request(dict(request.headers))
    if not auth_info:
        return JSONResponse(status_code=401, content={"error": "未登录"})

    ok = await db.complete_kyc(auth_info["user_id"])
    if not ok:
        return JSONResponse(status_code=404, content={"error": "用户不存在"})

    return {"kyc_completed": True}


# ---------------------------------------------------------------------------
# User role
# ---------------------------------------------------------------------------


@app.put("/api/user/role")
async def set_role(request: Request):
    """设置用户角色（student/parent/teacher）"""
    auth_info = await authenticate_request(dict(request.headers))
    if not auth_info:
        return JSONResponse(status_code=401, content={"error": "未登录"})

    body = await request.json()
    role = body.get("role")
    if role not in ("student", "parent", "teacher"):
        return JSONResponse(status_code=400, content={"error": "无效角色，可选: student/parent/teacher"})

    user = await db.update_user_role(auth_info["user_id"], role)
    if not user:
        return JSONResponse(status_code=404, content={"error": "用户不存在"})

    return {"role": user["role"]}


# ---------------------------------------------------------------------------
# Student profile
# ---------------------------------------------------------------------------


@app.get("/api/student/profile")
async def get_student_profile(request: Request):
    """获取当前学生画像"""
    auth_info = await authenticate_request(dict(request.headers))
    if not auth_info:
        return JSONResponse(status_code=401, content={"error": "未登录"})

    profile = await db.get_student_profile(auth_info["user_id"])
    return {"profile": profile}


@app.put("/api/student/profile")
async def update_student_profile(request: Request):
    """创建或更新学生画像"""
    auth_info = await authenticate_request(dict(request.headers))
    if not auth_info:
        return JSONResponse(status_code=401, content={"error": "未登录"})

    body = await request.json()
    profile = await db.upsert_student_profile(auth_info["user_id"], **body)
    return {"profile": profile}


# ---------------------------------------------------------------------------
# Parent-student links
# ---------------------------------------------------------------------------


@app.get("/api/parent/students")
async def get_linked_students(request: Request):
    """家长查看绑定的学生列表"""
    auth_info = await authenticate_request(dict(request.headers))
    if not auth_info:
        return JSONResponse(status_code=401, content={"error": "未登录"})

    students = await db.get_linked_students(auth_info["user_id"])
    return {"students": students}


@app.post("/api/parent/links")
async def link_student(request: Request):
    """家长绑定学生"""
    auth_info = await authenticate_request(dict(request.headers))
    if not auth_info:
        return JSONResponse(status_code=401, content={"error": "未登录"})

    body = await request.json()
    student_id = body.get("student_id")
    relationship = body.get("relationship", "parent")

    if not student_id:
        return JSONResponse(status_code=400, content={"error": "缺少 student_id"})

    # 验证学生存在且角色为 student
    student = await db.get_user_by_id(student_id)
    if not student or student.get("role") != "student":
        return JSONResponse(status_code=404, content={"error": "学生不存在"})

    link = await db.link_parent_student(auth_info["user_id"], student_id, relationship)
    return {"link": link}


@app.delete("/api/parent/links/{student_id}")
async def unlink_student(student_id: int, request: Request):
    """家长解绑学生"""
    auth_info = await authenticate_request(dict(request.headers))
    if not auth_info:
        return JSONResponse(status_code=401, content={"error": "未登录"})

    await db.unlink_parent_student(auth_info["user_id"], student_id)
    return {"success": True}


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
