"""
BasisPilot (贝领) — 业务数据库层
PostgreSQL 连接池 + 用户/订阅/用量 CRUD
"""

import json
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
        "daily_messages": 30,
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
    role            TEXT NOT NULL DEFAULT 'student',   -- student/parent/teacher
    email           TEXT,
    status          TEXT NOT NULL DEFAULT 'active',    -- active/suspended
    last_login_at   TIMESTAMPTZ,
    metadata        JSONB DEFAULT '{}',
    kyc_completed   BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- 迁移：为已有 biz_users 表添加新列（幂等，放在索引之前）
ALTER TABLE biz_users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'student';
ALTER TABLE biz_users ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE biz_users ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active';
ALTER TABLE biz_users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;
ALTER TABLE biz_users ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE biz_users ADD COLUMN IF NOT EXISTS kyc_completed BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_biz_users_supabase ON biz_users(supabase_uid);
CREATE INDEX IF NOT EXISTS idx_biz_users_wechat ON biz_users(wechat_openid);
CREATE INDEX IF NOT EXISTS idx_biz_users_role ON biz_users(role);
CREATE INDEX IF NOT EXISTS idx_biz_users_phone ON biz_users(phone);

-- 学生画像表（role=student 的用户扩展）
CREATE TABLE IF NOT EXISTS student_profiles (
    id              SERIAL PRIMARY KEY,
    user_id         INT NOT NULL UNIQUE REFERENCES biz_users(id) ON DELETE CASCADE,
    school_name     TEXT,                         -- "BASIS Shenzhen"
    campus          TEXT,                         -- "蛇口" / "福田"
    grade           TEXT,                         -- "G9" / "G10"
    enrollment_year INT,
    current_gpa     NUMERIC(3,2),                 -- 0.00-4.00
    ap_courses      JSONB DEFAULT '[]',           -- ["AP Calc BC", "AP Physics C"]
    weak_subjects   JSONB DEFAULT '[]',           -- ["数学", "物理"]
    strong_subjects JSONB DEFAULT '[]',           -- ["英语", "历史"]
    academic_status TEXT DEFAULT 'normal',         -- normal/watch/probation
    notes           TEXT,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 家长-学生绑定关系
CREATE TABLE IF NOT EXISTS parent_student_links (
    id              SERIAL PRIMARY KEY,
    parent_id       INT NOT NULL REFERENCES biz_users(id) ON DELETE CASCADE,
    student_id      INT NOT NULL REFERENCES biz_users(id) ON DELETE CASCADE,
    relationship    TEXT NOT NULL DEFAULT 'parent', -- parent/guardian/tutor
    status          TEXT NOT NULL DEFAULT 'active',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(parent_id, student_id)
);
CREATE INDEX IF NOT EXISTS idx_psl_parent ON parent_student_links(parent_id);
CREATE INDEX IF NOT EXISTS idx_psl_student ON parent_student_links(student_id);

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

-- =====================================================
-- 测评体系表
-- =====================================================

-- 题库表
CREATE TABLE IF NOT EXISTS assessment_questions (
    id              SERIAL PRIMARY KEY,
    subject         TEXT NOT NULL,              -- math/english/physics/chemistry/biology/history
    grade_level     TEXT NOT NULL,              -- G5, G6, ..., G12
    topic           TEXT NOT NULL,              -- e.g. "algebra", "quadratics", "reading_comp"
    subtopic        TEXT,                       -- e.g. "factoring", "completing_the_square"
    difficulty      REAL NOT NULL DEFAULT 0.5,  -- 0.0 ~ 1.0
    question_type   TEXT NOT NULL,              -- mcq/fill_in/short_answer/essay/experiment
    content_zh      JSONB NOT NULL,             -- { stem, options?, answer?, rubric?, images? }
    content_en      JSONB NOT NULL,             -- 英文版本
    basis_aligned   BOOLEAN DEFAULT TRUE,       -- 是否对齐 BASIS 课程进度
    usage_count     INT DEFAULT 0,              -- 使用次数
    correct_rate    REAL,                       -- 历史正确率
    avg_time_sec    INT,                        -- 平均答题时间(秒)
    tags            TEXT[],                     -- 标签数组
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_aq_subject_grade ON assessment_questions(subject, grade_level);
CREATE INDEX IF NOT EXISTS idx_aq_difficulty ON assessment_questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_aq_topic ON assessment_questions(topic);

-- 题库增强字段（幂等迁移）
ALTER TABLE assessment_questions ADD COLUMN IF NOT EXISTS source          TEXT;
ALTER TABLE assessment_questions ADD COLUMN IF NOT EXISTS source_year     INT;
ALTER TABLE assessment_questions ADD COLUMN IF NOT EXISTS source_detail   TEXT;
ALTER TABLE assessment_questions ADD COLUMN IF NOT EXISTS curriculum_code TEXT;
ALTER TABLE assessment_questions ADD COLUMN IF NOT EXISTS discrimination  REAL;
ALTER TABLE assessment_questions ADD COLUMN IF NOT EXISTS review_status   TEXT DEFAULT 'draft';
ALTER TABLE assessment_questions ADD COLUMN IF NOT EXISTS reviewed_by     TEXT;
ALTER TABLE assessment_questions ADD COLUMN IF NOT EXISTS version         INT DEFAULT 1;
ALTER TABLE assessment_questions ADD COLUMN IF NOT EXISTS explanation_zh  TEXT;
ALTER TABLE assessment_questions ADD COLUMN IF NOT EXISTS explanation_en  TEXT;
ALTER TABLE assessment_questions ADD COLUMN IF NOT EXISTS image_urls      TEXT[];
ALTER TABLE assessment_questions ADD COLUMN IF NOT EXISTS metadata        JSONB DEFAULT '{}';
ALTER TABLE assessment_questions ADD COLUMN IF NOT EXISTS batch_id        INT;

CREATE INDEX IF NOT EXISTS idx_aq_source ON assessment_questions(source);
CREATE INDEX IF NOT EXISTS idx_aq_review ON assessment_questions(review_status);
CREATE INDEX IF NOT EXISTS idx_aq_curriculum ON assessment_questions(curriculum_code);

-- 导入批次追踪表
CREATE TABLE IF NOT EXISTS question_import_batches (
    id              SERIAL PRIMARY KEY,
    batch_name      TEXT NOT NULL,
    source          TEXT NOT NULL,
    imported_by     TEXT,
    question_count  INT DEFAULT 0,
    status          TEXT DEFAULT 'pending',
    error_log       TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 测评会话表
CREATE TABLE IF NOT EXISTS assessment_sessions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         INT REFERENCES biz_users(id) ON DELETE SET NULL,
    anonymous_id    TEXT,                       -- 未注册用户的临时 ID
    assessment_type TEXT NOT NULL,              -- pre_admission / subject_diagnostic / quick
    subject         TEXT NOT NULL,              -- math/english/physics/...
    grade_level     TEXT NOT NULL,              -- 目标年级
    campus          TEXT,                       -- 目标校区
    status          TEXT NOT NULL DEFAULT 'in_progress', -- in_progress/completed/abandoned
    started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at    TIMESTAMPTZ,
    total_questions INT DEFAULT 0,
    correct_count   INT DEFAULT 0,
    final_score     REAL,                       -- 0-100
    ability_level   REAL,                       -- CAT 能力估值 0.0-1.0
    grade_equivalent TEXT,                      -- "At G7 level", "Above G8"
    time_spent_sec  INT DEFAULT 0,
    referral_code   TEXT,                       -- 推荐来源
    utm_source      TEXT,                       -- 营销追踪
    utm_campaign    TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_as_user ON assessment_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_as_anonymous ON assessment_sessions(anonymous_id);
CREATE INDEX IF NOT EXISTS idx_as_status ON assessment_sessions(status);

-- 答题记录表
CREATE TABLE IF NOT EXISTS assessment_answers (
    id              SERIAL PRIMARY KEY,
    session_id      UUID NOT NULL REFERENCES assessment_sessions(id) ON DELETE CASCADE,
    question_id     INT NOT NULL REFERENCES assessment_questions(id),
    question_order  INT NOT NULL,               -- 第几题
    user_answer     JSONB,                      -- 用户答案 (选项/文本/图片)
    is_correct      BOOLEAN,                    -- 规则评分结果 (Agent 评分的为 NULL 直到评完)
    score           REAL,                       -- 该题得分 (0-1)
    difficulty_at   REAL,                       -- 答题时的难度级别
    time_spent_sec  INT,                        -- 该题花费时间
    agent_feedback  TEXT,                       -- Agent 对开放题的评语
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_aa_session ON assessment_answers(session_id);

-- 测评报告表
CREATE TABLE IF NOT EXISTS assessment_reports (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id      UUID NOT NULL REFERENCES assessment_sessions(id) ON DELETE CASCADE,
    user_id         INT REFERENCES biz_users(id),
    report_data     JSONB NOT NULL,             -- 完整报告数据 (雷达图数据、分析文本等)
    summary_zh      TEXT,                       -- 中文摘要
    summary_en      TEXT,                       -- 英文摘要
    recommendations JSONB,                      -- 个性化建议列表
    share_token     TEXT UNIQUE,                -- 分享链接的 token
    view_count      INT DEFAULT 0,
    is_premium      BOOLEAN DEFAULT FALSE,      -- 是否是付费完整版报告
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ar_session ON assessment_reports(session_id);
CREATE INDEX IF NOT EXISTS idx_ar_user ON assessment_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_ar_share ON assessment_reports(share_token);
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


# ---------------------------------------------------------------------------
# 用户角色
# ---------------------------------------------------------------------------


async def update_user_role(user_id: int, role: str) -> dict | None:
    """设置用户角色（student/parent/teacher）"""
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            "UPDATE biz_users SET role = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
            role, user_id,
        )
        return dict(row) if row else None


async def complete_kyc(user_id: int) -> bool:
    """标记用户 KYC 已完成"""
    pool = await get_pool()
    async with pool.acquire() as conn:
        result = await conn.execute(
            "UPDATE biz_users SET kyc_completed = TRUE, updated_at = NOW() WHERE id = $1",
            user_id,
        )
        return result == "UPDATE 1"


# ---------------------------------------------------------------------------
# 学生画像 CRUD
# ---------------------------------------------------------------------------


async def get_student_profile(user_id: int) -> dict | None:
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT * FROM student_profiles WHERE user_id = $1", user_id,
        )
        return dict(row) if row else None


async def upsert_student_profile(user_id: int, **fields) -> dict:
    """创建或更新学生画像"""
    pool = await get_pool()
    allowed = {
        "school_name", "campus", "grade", "enrollment_year",
        "current_gpa", "ap_courses", "weak_subjects", "strong_subjects",
        "academic_status", "notes",
    }
    jsonb_fields = {"ap_courses", "weak_subjects", "strong_subjects"}
    data = {}
    for k, v in fields.items():
        if k not in allowed or v is None:
            continue
        # asyncpg 要求 JSONB 值为 JSON 字符串
        if k in jsonb_fields and isinstance(v, (list, dict)):
            data[k] = json.dumps(v, ensure_ascii=False)
        else:
            data[k] = v

    async with pool.acquire() as conn:
        existing = await conn.fetchrow(
            "SELECT id FROM student_profiles WHERE user_id = $1", user_id,
        )
        if existing:
            if not data:
                row = await conn.fetchrow(
                    "SELECT * FROM student_profiles WHERE user_id = $1", user_id,
                )
                return dict(row)
            sets = ", ".join(f"{k} = ${i+2}" for i, k in enumerate(data))
            vals = [user_id, *data.values()]
            row = await conn.fetchrow(
                f"UPDATE student_profiles SET {sets}, updated_at = NOW() WHERE user_id = $1 RETURNING *",
                *vals,
            )
        else:
            cols = ["user_id"] + list(data.keys())
            placeholders = ", ".join(f"${i+1}" for i in range(len(cols)))
            col_str = ", ".join(cols)
            vals = [user_id, *data.values()]
            row = await conn.fetchrow(
                f"INSERT INTO student_profiles ({col_str}) VALUES ({placeholders}) RETURNING *",
                *vals,
            )
        return dict(row)


# ---------------------------------------------------------------------------
# 家长-学生绑定
# ---------------------------------------------------------------------------


async def link_parent_student(parent_id: int, student_id: int, relationship: str = "parent") -> dict:
    """绑定家长和学生"""
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            INSERT INTO parent_student_links (parent_id, student_id, relationship)
            VALUES ($1, $2, $3)
            ON CONFLICT (parent_id, student_id) DO UPDATE SET status = 'active'
            RETURNING *
            """,
            parent_id, student_id, relationship,
        )
        return dict(row)


async def get_linked_students(parent_id: int) -> list[dict]:
    """获取家长绑定的所有学生"""
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            """
            SELECT u.id, u.nickname, u.phone, u.avatar_url,
                   sp.grade, sp.school_name, sp.campus, sp.current_gpa, sp.academic_status,
                   psl.relationship
            FROM parent_student_links psl
            JOIN biz_users u ON u.id = psl.student_id
            LEFT JOIN student_profiles sp ON sp.user_id = psl.student_id
            WHERE psl.parent_id = $1 AND psl.status = 'active'
            """,
            parent_id,
        )
        return [dict(r) for r in rows]


async def unlink_parent_student(parent_id: int, student_id: int) -> None:
    """解除家长-学生绑定"""
    pool = await get_pool()
    async with pool.acquire() as conn:
        await conn.execute(
            "UPDATE parent_student_links SET status = 'revoked' WHERE parent_id = $1 AND student_id = $2",
            parent_id, student_id,
        )


# ---------------------------------------------------------------------------
# 测评题库 CRUD
# ---------------------------------------------------------------------------


async def get_question(question_id: int) -> dict | None:
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT * FROM assessment_questions WHERE id = $1", question_id,
        )
        return dict(row) if row else None


async def query_questions(
    subject: str,
    grade_level: str,
    *,
    topic: str | None = None,
    difficulty_min: float = 0.0,
    difficulty_max: float = 1.0,
    question_type: str | None = None,
    exclude_ids: list[int] | None = None,
    limit: int = 20,
) -> list[dict]:
    """按条件查询题目，用于自适应出题"""
    pool = await get_pool()
    conditions = [
        "subject = $1",
        "grade_level = $2",
        "difficulty >= $3",
        "difficulty <= $4",
    ]
    params: list[Any] = [subject, grade_level, difficulty_min, difficulty_max]
    idx = 5

    if topic:
        conditions.append(f"topic = ${idx}")
        params.append(topic)
        idx += 1

    if question_type:
        conditions.append(f"question_type = ${idx}")
        params.append(question_type)
        idx += 1

    if exclude_ids:
        conditions.append(f"id != ALL(${idx}::int[])")
        params.append(exclude_ids)
        idx += 1

    where = " AND ".join(conditions)
    params.append(limit)
    sql = f"""
        SELECT * FROM assessment_questions
        WHERE {where}
        ORDER BY random()
        LIMIT ${idx}
    """
    async with pool.acquire() as conn:
        rows = await conn.fetch(sql, *params)
        return [dict(r) for r in rows]


async def find_next_question(
    subject: str,
    grade_level: str,
    target_difficulty: float,
    exclude_ids: list[int],
    tolerance: float = 0.15,
) -> dict | None:
    """
    为 CAT 算法查找下一道题，多级 fallback 确保不会因题库不足而中断：
    1. 目标年级 + 目标难度窗口
    2. 目标年级 + 扩大难度窗口 (±0.3)
    3. 目标年级 + 无难度限制
    4. 相邻年级 (±1) + 目标难度窗口
    5. 同学科全题库（无年级/难度限制）
    """
    pool = await get_pool()
    safe_exclude = exclude_ids or []

    # review_status 过滤: approved 优先，fallback 到全部（兼容种子题无状态）
    approved_filter = "AND (review_status = 'approved' OR review_status IS NULL OR review_status = 'draft')"

    async with pool.acquire() as conn:
        # Level 1: 目标年级 + 目标难度窗口
        d_min = max(0.0, target_difficulty - tolerance)
        d_max = min(1.0, target_difficulty + tolerance)
        row = await conn.fetchrow(
            f"""SELECT * FROM assessment_questions
               WHERE subject = $1 AND grade_level = $2
                 AND difficulty >= $3 AND difficulty <= $4
                 AND id != ALL($5::int[])
                 {approved_filter}
               ORDER BY random() LIMIT 1""",
            subject, grade_level, d_min, d_max, safe_exclude,
        )
        if row:
            return dict(row)

        # Level 2: 目标年级 + 扩大难度窗口
        d_min2 = max(0.0, target_difficulty - 0.35)
        d_max2 = min(1.0, target_difficulty + 0.35)
        row = await conn.fetchrow(
            f"""SELECT * FROM assessment_questions
               WHERE subject = $1 AND grade_level = $2
                 AND difficulty >= $3 AND difficulty <= $4
                 AND id != ALL($5::int[])
                 {approved_filter}
               ORDER BY random() LIMIT 1""",
            subject, grade_level, d_min2, d_max2, safe_exclude,
        )
        if row:
            return dict(row)

        # Level 3: 目标年级 + 无难度限制
        row = await conn.fetchrow(
            f"""SELECT * FROM assessment_questions
               WHERE subject = $1 AND grade_level = $2
                 AND id != ALL($3::int[])
                 {approved_filter}
               ORDER BY random() LIMIT 1""",
            subject, grade_level, safe_exclude,
        )
        if row:
            return dict(row)

        # Level 4: 相邻年级 (±1) + 按难度距离排序
        adjacent = _adjacent_grades(grade_level)
        if adjacent:
            row = await conn.fetchrow(
                f"""SELECT * FROM assessment_questions
                   WHERE subject = $1 AND grade_level = ANY($2::text[])
                     AND id != ALL($3::int[])
                     {approved_filter}
                   ORDER BY ABS(difficulty - $4) LIMIT 1""",
                subject, adjacent, safe_exclude, target_difficulty,
            )
            if row:
                return dict(row)

        # Level 5: 同学科全题库（不限状态，最后兜底）
        row = await conn.fetchrow(
            """SELECT * FROM assessment_questions
               WHERE subject = $1
                 AND id != ALL($2::int[])
               ORDER BY ABS(difficulty - $3) LIMIT 1""",
            subject, safe_exclude, target_difficulty,
        )
        return dict(row) if row else None


def _adjacent_grades(grade_level: str) -> list[str]:
    """返回相邻年级列表，如 G6 → ['G5', 'G7']"""
    import re
    m = re.match(r"G(\d+)", grade_level)
    if not m:
        return []
    n = int(m.group(1))
    result = []
    if n > 1:
        result.append(f"G{n - 1}")
    if n < 12:
        result.append(f"G{n + 1}")
    return result


async def increment_question_usage(question_id: int, is_correct: bool) -> None:
    """更新题目的使用次数和正确率"""
    pool = await get_pool()
    async with pool.acquire() as conn:
        await conn.execute(
            """
            UPDATE assessment_questions
            SET usage_count = usage_count + 1,
                correct_rate = CASE
                    WHEN usage_count = 0 THEN $2::real
                    ELSE (correct_rate * usage_count + $2::real) / (usage_count + 1)
                END,
                updated_at = NOW()
            WHERE id = $1
            """,
            question_id, 1.0 if is_correct else 0.0,
        )


async def bulk_insert_questions(questions: list[dict], *, batch_id: int | None = None) -> int:
    """批量导入题目（支持新字段），返回插入数量"""
    pool = await get_pool()
    async with pool.acquire() as conn:
        count = 0
        async with conn.transaction():
            for q in questions:
                await conn.execute(
                    """
                    INSERT INTO assessment_questions
                        (subject, grade_level, topic, subtopic, difficulty,
                         question_type, content_zh, content_en, basis_aligned, tags,
                         source, source_year, source_detail, curriculum_code,
                         discrimination, review_status, explanation_zh, explanation_en,
                         image_urls, metadata, batch_id)
                    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
                            $11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
                    """,
                    q["subject"],
                    q["grade_level"],
                    q["topic"],
                    q.get("subtopic"),
                    q.get("difficulty", 0.5),
                    q["question_type"],
                    json.dumps(q["content_zh"], ensure_ascii=False),
                    json.dumps(q.get("content_en") or q["content_zh"], ensure_ascii=False),
                    q.get("basis_aligned", True),
                    q.get("tags"),
                    q.get("source"),
                    q.get("source_year"),
                    q.get("source_detail"),
                    q.get("curriculum_code"),
                    q.get("discrimination"),
                    q.get("review_status", "draft"),
                    q.get("explanation_zh"),
                    q.get("explanation_en"),
                    q.get("image_urls"),
                    json.dumps(q.get("metadata") or {}, ensure_ascii=False),
                    batch_id,
                )
                count += 1
        return count


# ---------------------------------------------------------------------------
# 题库管理 CRUD (Admin)
# ---------------------------------------------------------------------------


async def create_question(q: dict) -> dict:
    """创建单个题目，返回完整记录"""
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            INSERT INTO assessment_questions
                (subject, grade_level, topic, subtopic, difficulty,
                 question_type, content_zh, content_en, basis_aligned, tags,
                 source, source_year, source_detail, curriculum_code,
                 discrimination, review_status, explanation_zh, explanation_en,
                 image_urls, metadata)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
                    $11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
            RETURNING *
            """,
            q["subject"],
            q["grade_level"],
            q["topic"],
            q.get("subtopic"),
            q.get("difficulty", 0.5),
            q["question_type"],
            json.dumps(q["content_zh"], ensure_ascii=False),
            json.dumps(q.get("content_en") or q["content_zh"], ensure_ascii=False),
            q.get("basis_aligned", True),
            q.get("tags"),
            q.get("source"),
            q.get("source_year"),
            q.get("source_detail"),
            q.get("curriculum_code"),
            q.get("discrimination"),
            q.get("review_status", "draft"),
            q.get("explanation_zh"),
            q.get("explanation_en"),
            q.get("image_urls"),
            json.dumps(q.get("metadata") or {}, ensure_ascii=False),
        )
        return dict(row)


async def update_question(question_id: int, **fields) -> dict | None:
    """更新题目字段"""
    allowed = {
        "subject", "grade_level", "topic", "subtopic", "difficulty",
        "question_type", "content_zh", "content_en", "basis_aligned", "tags",
        "source", "source_year", "source_detail", "curriculum_code",
        "discrimination", "review_status", "reviewed_by", "version",
        "explanation_zh", "explanation_en", "image_urls", "metadata",
    }
    jsonb_fields = {"content_zh", "content_en", "metadata"}
    data = {}
    for k, v in fields.items():
        if k not in allowed:
            continue
        if k in jsonb_fields and isinstance(v, (dict, list)):
            data[k] = json.dumps(v, ensure_ascii=False)
        else:
            data[k] = v
    if not data:
        return await get_question(question_id)

    pool = await get_pool()
    sets = ", ".join(f"{k} = ${i+2}" for i, k in enumerate(data))
    vals: list[Any] = [question_id, *data.values()]
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            f"UPDATE assessment_questions SET {sets}, updated_at = NOW() WHERE id = $1 RETURNING *",
            *vals,
        )
        return dict(row) if row else None


async def delete_question(question_id: int, hard: bool = False) -> bool:
    """删除题目（默认归档，hard=True 时物理删除）"""
    pool = await get_pool()
    async with pool.acquire() as conn:
        if hard:
            result = await conn.execute(
                "DELETE FROM assessment_questions WHERE id = $1", question_id,
            )
        else:
            result = await conn.execute(
                "UPDATE assessment_questions SET review_status = 'archived', updated_at = NOW() WHERE id = $1",
                question_id,
            )
        return result.endswith("1")


async def review_question(question_id: int, status: str, reviewed_by: str) -> dict | None:
    """审核题目状态"""
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """UPDATE assessment_questions
               SET review_status = $2, reviewed_by = $3, updated_at = NOW()
               WHERE id = $1 RETURNING *""",
            question_id, status, reviewed_by,
        )
        return dict(row) if row else None


async def query_questions_paginated(
    *,
    subject: str | None = None,
    grade_level: str | None = None,
    topic: str | None = None,
    review_status: str | None = None,
    source: str | None = None,
    question_type: str | None = None,
    search: str | None = None,
    page: int = 1,
    page_size: int = 20,
) -> dict:
    """分页查询题目，支持多条件筛选"""
    pool = await get_pool()
    conditions: list[str] = []
    params: list[Any] = []
    idx = 1

    if subject:
        conditions.append(f"subject = ${idx}")
        params.append(subject)
        idx += 1
    if grade_level:
        conditions.append(f"grade_level = ${idx}")
        params.append(grade_level)
        idx += 1
    if topic:
        conditions.append(f"topic = ${idx}")
        params.append(topic)
        idx += 1
    if review_status:
        conditions.append(f"review_status = ${idx}")
        params.append(review_status)
        idx += 1
    if source:
        conditions.append(f"source = ${idx}")
        params.append(source)
        idx += 1
    if question_type:
        conditions.append(f"question_type = ${idx}")
        params.append(question_type)
        idx += 1
    if search:
        conditions.append(f"(content_zh::text ILIKE ${idx} OR content_en::text ILIKE ${idx})")
        params.append(f"%{search}%")
        idx += 1

    where = " AND ".join(conditions) if conditions else "TRUE"
    offset = (page - 1) * page_size

    async with pool.acquire() as conn:
        total = await conn.fetchval(
            f"SELECT COUNT(*) FROM assessment_questions WHERE {where}", *params,
        )
        params.extend([page_size, offset])
        rows = await conn.fetch(
            f"""SELECT * FROM assessment_questions
                WHERE {where}
                ORDER BY created_at DESC
                LIMIT ${idx} OFFSET ${idx + 1}""",
            *params,
        )
        return {
            "items": [dict(r) for r in rows],
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": (total + page_size - 1) // page_size,
        }


async def get_question_stats() -> dict:
    """题库统计概览"""
    pool = await get_pool()
    async with pool.acquire() as conn:
        total = await conn.fetchval("SELECT COUNT(*) FROM assessment_questions")
        by_subject = await conn.fetch(
            "SELECT subject, COUNT(*) as cnt FROM assessment_questions GROUP BY subject ORDER BY cnt DESC",
        )
        by_grade = await conn.fetch(
            "SELECT grade_level, COUNT(*) as cnt FROM assessment_questions GROUP BY grade_level ORDER BY grade_level",
        )
        by_status = await conn.fetch(
            "SELECT review_status, COUNT(*) as cnt FROM assessment_questions GROUP BY review_status",
        )
        by_type = await conn.fetch(
            "SELECT question_type, COUNT(*) as cnt FROM assessment_questions GROUP BY question_type",
        )
        by_source = await conn.fetch(
            "SELECT COALESCE(source, 'unknown') as source, COUNT(*) as cnt FROM assessment_questions GROUP BY source ORDER BY cnt DESC",
        )
        difficulty = await conn.fetchrow(
            "SELECT AVG(difficulty) as avg, MIN(difficulty) as min, MAX(difficulty) as max FROM assessment_questions",
        )
        return {
            "total": total,
            "by_subject": {r["subject"]: r["cnt"] for r in by_subject},
            "by_grade": {r["grade_level"]: r["cnt"] for r in by_grade},
            "by_review_status": {r["review_status"]: r["cnt"] for r in by_status},
            "by_question_type": {r["question_type"]: r["cnt"] for r in by_type},
            "by_source": {r["source"]: r["cnt"] for r in by_source},
            "difficulty": {
                "avg": round(float(difficulty["avg"] or 0), 3),
                "min": round(float(difficulty["min"] or 0), 3),
                "max": round(float(difficulty["max"] or 0), 3),
            },
        }


# ---------------------------------------------------------------------------
# 标签 (Taxonomy) 查询/更新
# ---------------------------------------------------------------------------


async def get_questions_for_tagging(
    *,
    subject: str | None = None,
    grade_level: str | None = None,
    skip_tagged: bool = True,
    limit: int | None = None,
) -> list[dict]:
    """获取待打标的题目列表（默认跳过已标注 taxonomy v1 的题目）"""
    pool = await get_pool()
    conditions: list[str] = []
    params: list[Any] = []
    idx = 1

    if subject:
        conditions.append(f"subject = ${idx}")
        params.append(subject)
        idx += 1
    if grade_level:
        conditions.append(f"grade_level = ${idx}")
        params.append(grade_level)
        idx += 1
    if skip_tagged:
        conditions.append("(metadata->>'taxonomy' IS NULL OR (metadata->'taxonomy'->>'version') != '1.0')")

    where = " AND ".join(conditions) if conditions else "TRUE"
    limit_clause = f"LIMIT ${idx}" if limit else ""
    if limit:
        params.append(limit)

    async with pool.acquire() as conn:
        rows = await conn.fetch(
            f"""SELECT * FROM assessment_questions
                WHERE {where}
                ORDER BY id
                {limit_clause}""",
            *params,
        )
        return [dict(r) for r in rows]


async def update_question_tags(
    question_id: int,
    tags: list[str],
    taxonomy_metadata: dict,
) -> dict | None:
    """更新题目的 tags 数组和 metadata.taxonomy 字段"""
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """UPDATE assessment_questions
               SET tags = $2,
                   metadata = jsonb_set(
                       COALESCE(metadata, '{}'),
                       '{taxonomy}',
                       $3::jsonb
                   ),
                   updated_at = NOW()
               WHERE id = $1
               RETURNING *""",
            question_id,
            tags,
            json.dumps(taxonomy_metadata, ensure_ascii=False),
        )
        return dict(row) if row else None


async def get_tag_stats() -> dict:
    """标签分布统计"""
    pool = await get_pool()
    async with pool.acquire() as conn:
        total = await conn.fetchval("SELECT COUNT(*) FROM assessment_questions")

        # Tagged count (has taxonomy metadata)
        tagged = await conn.fetchval(
            "SELECT COUNT(*) FROM assessment_questions WHERE metadata->'taxonomy' IS NOT NULL AND (metadata->'taxonomy'->>'version') = '1.0'"
        )

        # Bloom's distribution
        blooms = await conn.fetch(
            """SELECT metadata->'taxonomy'->'blooms'->>'level' AS level, COUNT(*) AS cnt
               FROM assessment_questions
               WHERE metadata->'taxonomy'->'blooms'->>'level' IS NOT NULL
               GROUP BY level ORDER BY cnt DESC"""
        )

        # DOK distribution
        dok = await conn.fetch(
            """SELECT metadata->'taxonomy'->'dok'->>'level' AS level, COUNT(*) AS cnt
               FROM assessment_questions
               WHERE metadata->'taxonomy'->'dok'->>'level' IS NOT NULL
               GROUP BY level ORDER BY cnt DESC"""
        )

        # Band distribution (from tags)
        bands = await conn.fetch(
            """SELECT t AS band, COUNT(*) AS cnt
               FROM assessment_questions, unnest(tags) AS t
               WHERE t LIKE 'band:%'
               GROUP BY t ORDER BY cnt DESC"""
        )

        # Top CCSS codes
        ccss = await conn.fetch(
            """SELECT t AS code, COUNT(*) AS cnt
               FROM assessment_questions, unnest(tags) AS t
               WHERE t LIKE 'ccss:%'
               GROUP BY t ORDER BY cnt DESC LIMIT 20"""
        )

        # Top cognitive skills
        skills = await conn.fetch(
            """SELECT t AS skill, COUNT(*) AS cnt
               FROM assessment_questions, unnest(tags) AS t
               WHERE t LIKE 'skill:%'
               GROUP BY t ORDER BY cnt DESC LIMIT 15"""
        )

        # Misconception coverage
        misconceptions = await conn.fetch(
            """SELECT t AS mc, COUNT(*) AS cnt
               FROM assessment_questions, unnest(tags) AS t
               WHERE t LIKE 'mc:%'
               GROUP BY t ORDER BY cnt DESC LIMIT 15"""
        )

        return {
            "total": total,
            "tagged": tagged,
            "untagged": total - tagged,
            "coverage_pct": round(tagged / total * 100, 1) if total > 0 else 0,
            "blooms": {r["level"]: r["cnt"] for r in blooms},
            "dok": {r["level"]: r["cnt"] for r in dok},
            "bands": {r["band"].replace("band:", ""): r["cnt"] for r in bands},
            "ccss_codes": {r["code"].replace("ccss:", ""): r["cnt"] for r in ccss},
            "cognitive_skills": {r["skill"].replace("skill:", ""): r["cnt"] for r in skills},
            "misconceptions": {r["mc"].replace("mc:", ""): r["cnt"] for r in misconceptions},
        }


# ---------------------------------------------------------------------------
# 导入批次 CRUD
# ---------------------------------------------------------------------------


async def create_import_batch(
    batch_name: str, source: str, imported_by: str | None = None,
) -> dict:
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """INSERT INTO question_import_batches (batch_name, source, imported_by)
               VALUES ($1, $2, $3) RETURNING *""",
            batch_name, source, imported_by,
        )
        return dict(row)


async def update_import_batch(batch_id: int, **fields) -> dict | None:
    allowed = {"status", "question_count", "error_log"}
    data = {k: v for k, v in fields.items() if k in allowed}
    if not data:
        return None
    pool = await get_pool()
    sets = ", ".join(f"{k} = ${i+2}" for i, k in enumerate(data))
    vals: list[Any] = [batch_id, *data.values()]
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            f"UPDATE question_import_batches SET {sets} WHERE id = $1 RETURNING *",
            *vals,
        )
        return dict(row) if row else None


async def list_import_batches(limit: int = 50) -> list[dict]:
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            "SELECT * FROM question_import_batches ORDER BY created_at DESC LIMIT $1",
            limit,
        )
        return [dict(r) for r in rows]


# ---------------------------------------------------------------------------
# 测评会话 CRUD
# ---------------------------------------------------------------------------


async def create_assessment_session(
    *,
    assessment_type: str,
    subject: str,
    grade_level: str,
    campus: str | None = None,
    user_id: int | None = None,
    anonymous_id: str | None = None,
    referral_code: str | None = None,
    utm_source: str | None = None,
    utm_campaign: str | None = None,
) -> dict:
    """创建测评会话（支持匿名用户）"""
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            INSERT INTO assessment_sessions
                (assessment_type, subject, grade_level, campus,
                 user_id, anonymous_id, referral_code, utm_source, utm_campaign)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
            """,
            assessment_type, subject, grade_level, campus,
            user_id, anonymous_id, referral_code, utm_source, utm_campaign,
        )
        return dict(row)


async def get_assessment_session(session_id: str) -> dict | None:
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT * FROM assessment_sessions WHERE id = $1",
            session_id,
        )
        return dict(row) if row else None


async def update_assessment_session(session_id: str, **fields) -> dict | None:
    """更新测评会话字段"""
    allowed = {
        "status", "completed_at", "total_questions", "correct_count",
        "final_score", "ability_level", "grade_equivalent", "time_spent_sec",
        "user_id",
    }
    data = {k: v for k, v in fields.items() if k in allowed and v is not None}
    if not data:
        return await get_assessment_session(session_id)

    pool = await get_pool()
    sets = ", ".join(f"{k} = ${i+2}" for i, k in enumerate(data))
    vals = [session_id, *data.values()]
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            f"UPDATE assessment_sessions SET {sets} WHERE id = $1 RETURNING *",
            *vals,
        )
        return dict(row) if row else None


async def get_user_assessment_sessions(
    user_id: int, *, limit: int = 20
) -> list[dict]:
    """获取用户历史测评列表"""
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            """
            SELECT * FROM assessment_sessions
            WHERE user_id = $1
            ORDER BY created_at DESC
            LIMIT $2
            """,
            user_id, limit,
        )
        return [dict(r) for r in rows]


# ---------------------------------------------------------------------------
# 答题记录 CRUD
# ---------------------------------------------------------------------------


async def save_answer(
    *,
    session_id: str,
    question_id: int,
    question_order: int,
    user_answer: dict | str | None = None,
    is_correct: bool | None = None,
    score: float | None = None,
    difficulty_at: float | None = None,
    time_spent_sec: int | None = None,
    agent_feedback: str | None = None,
) -> dict:
    """保存一条答题记录"""
    pool = await get_pool()
    answer_json = None
    if user_answer is not None:
        answer_json = json.dumps(user_answer, ensure_ascii=False) if isinstance(user_answer, (dict, list)) else json.dumps(user_answer)
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            INSERT INTO assessment_answers
                (session_id, question_id, question_order, user_answer,
                 is_correct, score, difficulty_at, time_spent_sec, agent_feedback)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
            """,
            session_id, question_id, question_order, answer_json,
            is_correct, score, difficulty_at, time_spent_sec, agent_feedback,
        )
        return dict(row)


async def get_session_answers(session_id: str) -> list[dict]:
    """获取某次测评的所有答题记录"""
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            """
            SELECT a.*, q.subject, q.topic, q.subtopic, q.difficulty, q.question_type, q.tags
            FROM assessment_answers a
            JOIN assessment_questions q ON q.id = a.question_id
            WHERE a.session_id = $1
            ORDER BY a.question_order
            """,
            session_id,
        )
        return [dict(r) for r in rows]


# ---------------------------------------------------------------------------
# 测评报告 CRUD
# ---------------------------------------------------------------------------


async def create_assessment_report(
    *,
    session_id: str,
    user_id: int | None = None,
    report_data: dict,
    summary_zh: str | None = None,
    summary_en: str | None = None,
    recommendations: list | None = None,
    share_token: str | None = None,
    is_premium: bool = False,
) -> dict:
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            INSERT INTO assessment_reports
                (session_id, user_id, report_data, summary_zh, summary_en,
                 recommendations, share_token, is_premium)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
            """,
            session_id,
            user_id,
            json.dumps(report_data, ensure_ascii=False),
            summary_zh,
            summary_en,
            json.dumps(recommendations, ensure_ascii=False) if recommendations else None,
            share_token,
            is_premium,
        )
        return dict(row)


async def get_assessment_report(report_id: str) -> dict | None:
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT * FROM assessment_reports WHERE id = $1", report_id,
        )
        return dict(row) if row else None


async def get_report_by_session(session_id: str) -> dict | None:
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT * FROM assessment_reports WHERE session_id = $1", session_id,
        )
        return dict(row) if row else None


async def get_report_by_share_token(share_token: str) -> dict | None:
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT * FROM assessment_reports WHERE share_token = $1", share_token,
        )
        if row:
            # 增加查看次数
            await conn.execute(
                "UPDATE assessment_reports SET view_count = view_count + 1 WHERE id = $1",
                row["id"],
            )
        return dict(row) if row else None


async def generate_share_token(report_id: str) -> str:
    """为报告生成唯一分享 token"""
    import secrets
    token = secrets.token_urlsafe(16)
    pool = await get_pool()
    async with pool.acquire() as conn:
        await conn.execute(
            "UPDATE assessment_reports SET share_token = $1 WHERE id = $2",
            token, report_id,
        )
    return token


# ---------------------------------------------------------------------------
# 匿名会话认领
# ---------------------------------------------------------------------------


async def claim_anonymous_sessions(user_id: int, anonymous_id: str) -> int:
    """将匿名会话 + 报告关联到已注册用户，返回认领数量"""
    pool = await get_pool()
    async with pool.acquire() as conn:
        async with conn.transaction():
            # Update sessions
            result = await conn.execute(
                """
                UPDATE assessment_sessions
                SET user_id = $1
                WHERE anonymous_id = $2 AND user_id IS NULL
                """,
                user_id, anonymous_id,
            )
            count = int(result.split()[-1])  # "UPDATE N"

            # Update reports linked to those sessions
            await conn.execute(
                """
                UPDATE assessment_reports r
                SET user_id = $1
                FROM assessment_sessions s
                WHERE r.session_id = s.id
                  AND s.anonymous_id = $2
                  AND r.user_id IS NULL
                """,
                user_id, anonymous_id,
            )

            return count
