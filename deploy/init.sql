-- =============================================================================
-- BasisPilot (贝领) — 业务表初始化
-- 在 LangGraph 自带的 checkpoint 表之外，创建业务所需的用户/订阅/用量表
-- =============================================================================

-- 业务用户表（关联 Supabase auth 或微信 OpenID）
CREATE TABLE IF NOT EXISTS biz_users (
    id              SERIAL PRIMARY KEY,
    supabase_uid    TEXT UNIQUE,
    wechat_openid   TEXT UNIQUE,
    wechat_unionid  TEXT,
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
    plan            TEXT NOT NULL DEFAULT 'free',
    status          TEXT NOT NULL DEFAULT 'active',
    started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at      TIMESTAMPTZ,
    payment_id      TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);

-- 用量日志表（按天汇总）
CREATE TABLE IF NOT EXISTS usage_logs (
    id              SERIAL PRIMARY KEY,
    user_id         INT NOT NULL REFERENCES biz_users(id) ON DELETE CASCADE,
    usage_date      DATE NOT NULL DEFAULT CURRENT_DATE,
    message_count   INT NOT NULL DEFAULT 0,
    agent_calls     JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, usage_date)
);
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_date ON usage_logs(user_id, usage_date);

-- 增值服务购买记录
CREATE TABLE IF NOT EXISTS purchases (
    id              SERIAL PRIMARY KEY,
    user_id         INT NOT NULL REFERENCES biz_users(id) ON DELETE CASCADE,
    product_type    TEXT NOT NULL,
    product_name    TEXT NOT NULL,
    price_cents     INT NOT NULL,
    payment_id      TEXT,
    status          TEXT NOT NULL DEFAULT 'pending',
    expires_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_purchases_user ON purchases(user_id);
