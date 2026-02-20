"""
BASIS Expert Council — 业务数据库层
PostgreSQL 连接池 + 用户/订阅/用量 CRUD
"""

import os
from datetime import date, datetime
from enum import Enum
from typing import Any

import asyncpg

# ---------------------------------------------------------------------------
# 配置
# ---------------------------------------------------------------------------

DATABASE_URL = os.getenv(
    "BASIS_DATABASE_URL",
    os.getenv("DATABASE_URI", "postgresql://postgres:postgres@localhost:5433/langgraph"),
)

# ---------------------------------------------------------------------------
# 连接池（单例）
# ---------------------------------------------------------------------------

_pool: asyncpg.Pool | None = None


async def get_pool() -> asyncpg.Pool:
    """获取或创建全局连接池"""
    global _pool
    if _pool is None or _pool._closed:
        _pool = await asyncpg.create_pool(DATABASE_URL, min_size=2, max_size=10)
    return _pool


async def close_pool() -> None:
    global _pool
    if _pool and not _pool._closed:
        await _pool.close()
        _pool = None


# ---------------------------------------------------------------------------
# 枚举
# ---------------------------------------------------------------------------


class PlanTier(str, Enum):
    FREE = "free"
    BASIC = "basic"
    PREMIUM = "premium"
    VIP = "vip"


class SubscriptionStatus(str, Enum):
    ACTIVE = "active"
    EXPIRED = "expired"
    CANCELLED = "cancelled"


# ---------------------------------------------------------------------------
# Plan 配额定义
# ---------------------------------------------------------------------------

PLAN_LIMITS: dict[str, dict[str, Any]] = {
    PlanTier.FREE: {
        "daily_messages": 5,
        "allowed_agents": ["math-expert", "science-expert"],
        "reports_per_month": 0,
        "priority": False,
    },
    PlanTier.BASIC: {
        "daily_messages": 50,
        "allowed_agents": [
            "math-expert", "science-expert", "humanities-expert",
            "curriculum-advisor", "business-advisor",
        ],
        "reports_per_month": 1,
        "priority": False,
    },
    PlanTier.PREMIUM: {
        "daily_messages": -1,  # unlimited
        "allowed_agents": [
            "math-expert", "science-expert", "humanities-expert",
            "curriculum-advisor", "business-advisor",
        ],
        "reports_per_month": 6,  # semester reports
        "priority": False,
    },
    PlanTier.VIP: {
        "daily_messages": -1,  # unlimited
        "allowed_agents": [
            "math-expert", "science-expert", "humanities-expert",
            "curriculum-advisor", "business-advisor",
        ],
        "reports_per_month": 30,  # monthly reports
        "priority": True,
    },
}


# ---------------------------------------------------------------------------
# 建表 DDL
# ---------------------------------------------------------------------------

SCHEMA_SQL = """
-- 业务用户表（关联 Supabase auth 或微信 OpenID）
CREATE TABLE IF NOT EXISTS biz_users (
    id              SERIAL PRIMARY KEY,
    supabase_uid    TEXT UNIQUE,          -- Supabase auth.users.id
    wechat_openid   TEXT UNIQUE,          -- 微信 H5 OpenID
    wechat_unionid  TEXT,                 -- 微信 UnionID（跨平台）
    phone           TEXT,
    nickname        TEXT,
    avatar_url      TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_biz_users_supabase ON biz_users(supabase_uid);
CREATE INDEX IF NOT EXISTS idx_biz_users_wechat ON biz_users(wechat_openid);

-- 订阅表
CREATE TABLE IF NOT EXISTS subscriptions (
    id              SERIAL PRIMARY KEY,
    user_id         INT NOT NULL REFERENCES biz_users(id) ON DELETE CASCADE,
    plan            TEXT NOT NULL DEFAULT 'free',    -- free/basic/premium/vip
    status          TEXT NOT NULL DEFAULT 'active',  -- active/expired/cancelled
    started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at      TIMESTAMPTZ,
    payment_id      TEXT,                            -- 微信支付订单号
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);

-- 用量日志表（按天汇总）
CREATE TABLE IF NOT EXISTS usage_logs (
    id              SERIAL PRIMARY KEY,
    user_id         INT NOT NULL REFERENCES biz_users(id) ON DELETE CASCADE,
    usage_date      DATE NOT NULL DEFAULT CURRENT_DATE,
    message_count   INT NOT NULL DEFAULT 0,
    agent_calls     JSONB DEFAULT '{}',   -- {"math-expert": 3, "science-expert": 1}
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, usage_date)
);
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_date ON usage_logs(user_id, usage_date);

-- 增值服务购买记录
CREATE TABLE IF NOT EXISTS purchases (
    id              SERIAL PRIMARY KEY,
    user_id         INT NOT NULL REFERENCES biz_users(id) ON DELETE CASCADE,
    product_type    TEXT NOT NULL,          -- onboarding_2w/onboarding_4w/ap_single/ap_bundle/assessment/planning
    product_name    TEXT NOT NULL,
    price_cents     INT NOT NULL,           -- 价格（分）
    payment_id      TEXT,                   -- 微信支付订单号
    status          TEXT NOT NULL DEFAULT 'pending', -- pending/paid/refunded
    expires_at      TIMESTAMPTZ,            -- 课程类产品的有效期
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_purchases_user ON purchases(user_id);
"""


async def init_schema() -> None:
    """创建业务表（幂等）"""
    pool = await get_pool()
    async with pool.acquire() as conn:
        await conn.execute(SCHEMA_SQL)


# ---------------------------------------------------------------------------
# 用户 CRUD
# ---------------------------------------------------------------------------


async def get_user_by_supabase_uid(uid: str) -> dict | None:
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow("SELECT * FROM biz_users WHERE supabase_uid = $1", uid)
        return dict(row) if row else None


async def get_user_by_wechat_openid(openid: str) -> dict | None:
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow("SELECT * FROM biz_users WHERE wechat_openid = $1", openid)
        return dict(row) if row else None


async def get_user_by_id(user_id: int) -> dict | None:
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow("SELECT * FROM biz_users WHERE id = $1", user_id)
        return dict(row) if row else None


async def create_user(
    *,
    supabase_uid: str | None = None,
    wechat_openid: str | None = None,
    wechat_unionid: str | None = None,
    phone: str | None = None,
    nickname: str | None = None,
    avatar_url: str | None = None,
) -> dict:
    """创建用户并自动创建免费订阅"""
    pool = await get_pool()
    async with pool.acquire() as conn:
        async with conn.transaction():
            row = await conn.fetchrow(
                """
                INSERT INTO biz_users (supabase_uid, wechat_openid, wechat_unionid, phone, nickname, avatar_url)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *
                """,
                supabase_uid, wechat_openid, wechat_unionid, phone, nickname, avatar_url,
            )
            user = dict(row)
            # 自动创建免费订阅
            await conn.execute(
                "INSERT INTO subscriptions (user_id, plan, status) VALUES ($1, 'free', 'active')",
                user["id"],
            )
            return user


async def upsert_user_by_wechat(
    openid: str,
    unionid: str | None = None,
    nickname: str | None = None,
    avatar_url: str | None = None,
) -> dict:
    """通过微信登录：存在则更新，不存在则创建"""
    existing = await get_user_by_wechat_openid(openid)
    if existing:
        pool = await get_pool()
        async with pool.acquire() as conn:
            await conn.execute(
                """
                UPDATE biz_users SET
                    wechat_unionid = COALESCE($2, wechat_unionid),
                    nickname = COALESCE($3, nickname),
                    avatar_url = COALESCE($4, avatar_url),
                    updated_at = NOW()
                WHERE wechat_openid = $1
                """,
                openid, unionid, nickname, avatar_url,
            )
            row = await conn.fetchrow("SELECT * FROM biz_users WHERE wechat_openid = $1", openid)
            return dict(row)
    return await create_user(
        wechat_openid=openid,
        wechat_unionid=unionid,
        nickname=nickname,
        avatar_url=avatar_url,
    )


async def link_supabase_to_user(user_id: int, supabase_uid: str) -> None:
    """将 Supabase UID 关联到已有用户"""
    pool = await get_pool()
    async with pool.acquire() as conn:
        await conn.execute(
            "UPDATE biz_users SET supabase_uid = $1, updated_at = NOW() WHERE id = $2",
            supabase_uid, user_id,
        )


# ---------------------------------------------------------------------------
# 订阅 CRUD
# ---------------------------------------------------------------------------


async def get_active_subscription(user_id: int) -> dict | None:
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            SELECT * FROM subscriptions
            WHERE user_id = $1 AND status = 'active'
              AND (expires_at IS NULL OR expires_at > NOW())
            ORDER BY created_at DESC LIMIT 1
            """,
            user_id,
        )
        return dict(row) if row else None


async def get_user_plan(user_id: int) -> str:
    """获取用户当前 plan tier，默认 free"""
    sub = await get_active_subscription(user_id)
    return sub["plan"] if sub else PlanTier.FREE


async def create_subscription(
    user_id: int,
    plan: str,
    expires_at: datetime | None = None,
    payment_id: str | None = None,
) -> dict:
    pool = await get_pool()
    async with pool.acquire() as conn:
        async with conn.transaction():
            # 将旧的活跃订阅标记为过期
            await conn.execute(
                "UPDATE subscriptions SET status = 'expired' WHERE user_id = $1 AND status = 'active'",
                user_id,
            )
            row = await conn.fetchrow(
                """
                INSERT INTO subscriptions (user_id, plan, status, expires_at, payment_id)
                VALUES ($1, $2, 'active', $3, $4)
                RETURNING *
                """,
                user_id, plan, expires_at, payment_id,
            )
            return dict(row)


# ---------------------------------------------------------------------------
# 用量 CRUD
# ---------------------------------------------------------------------------


async def get_daily_usage(user_id: int, usage_date: date | None = None) -> dict:
    """获取某天的用量，不存在则返回零值"""
    if usage_date is None:
        usage_date = date.today()
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT * FROM usage_logs WHERE user_id = $1 AND usage_date = $2",
            user_id, usage_date,
        )
        if row:
            return dict(row)
        return {"user_id": user_id, "usage_date": usage_date, "message_count": 0, "agent_calls": {}}


async def increment_usage(user_id: int, agent_name: str | None = None) -> dict:
    """增加一次对话用量（原子操作）"""
    today = date.today()
    pool = await get_pool()
    async with pool.acquire() as conn:
        # Upsert 用量记录
        row = await conn.fetchrow(
            """
            INSERT INTO usage_logs (user_id, usage_date, message_count, updated_at)
            VALUES ($1, $2, 1, NOW())
            ON CONFLICT (user_id, usage_date) DO UPDATE
            SET message_count = usage_logs.message_count + 1, updated_at = NOW()
            RETURNING *
            """,
            user_id, today,
        )
        # 更新智能体调用统计
        if agent_name:
            await conn.execute(
                """
                UPDATE usage_logs
                SET agent_calls = jsonb_set(
                    COALESCE(agent_calls, '{}'),
                    $3::text[],
                    (COALESCE(agent_calls->>$4, '0')::int + 1)::text::jsonb
                )
                WHERE user_id = $1 AND usage_date = $2
                """,
                user_id, today, [agent_name], agent_name,
            )
        return dict(row)


async def check_quota(user_id: int) -> dict:
    """检查用户是否还有配额，返回配额信息"""
    plan = await get_user_plan(user_id)
    limits = PLAN_LIMITS.get(plan, PLAN_LIMITS[PlanTier.FREE])
    usage = await get_daily_usage(user_id)

    daily_limit = limits["daily_messages"]
    used = usage["message_count"]

    if daily_limit == -1:
        remaining = -1  # unlimited
        allowed = True
    else:
        remaining = max(0, daily_limit - used)
        allowed = remaining > 0

    return {
        "allowed": allowed,
        "plan": plan,
        "daily_limit": daily_limit,
        "used_today": used,
        "remaining": remaining,
        "allowed_agents": limits["allowed_agents"],
        "priority": limits["priority"],
    }
