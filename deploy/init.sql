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

-- 学力档案: 能力快照表 (per user × subject × topic)
CREATE TABLE IF NOT EXISTS student_ability_scores (
    id              SERIAL PRIMARY KEY,
    user_id         INT NOT NULL REFERENCES biz_users(id) ON DELETE CASCADE,
    subject         TEXT NOT NULL,
    topic           TEXT,
    ability_score   REAL NOT NULL,
    score_100       REAL NOT NULL,
    confidence      REAL DEFAULT 0.5,
    assessment_count INT DEFAULT 1,
    last_session_id UUID,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, subject, topic)
);
CREATE INDEX IF NOT EXISTS idx_sas_user ON student_ability_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_sas_user_subject ON student_ability_scores(user_id, subject);

-- 学力档案: 能力时间序列表 (append-only)
CREATE TABLE IF NOT EXISTS ability_score_history (
    id              SERIAL PRIMARY KEY,
    user_id         INT NOT NULL REFERENCES biz_users(id) ON DELETE CASCADE,
    subject         TEXT NOT NULL,
    topic           TEXT,
    ability_score   REAL NOT NULL,
    score_100       REAL NOT NULL,
    session_id      UUID REFERENCES assessment_sessions(id),
    recorded_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ash_user_subject ON ability_score_history(user_id, subject);
CREATE INDEX IF NOT EXISTS idx_ash_user_time ON ability_score_history(user_id, recorded_at);

-- =====================================================
-- 学力档案 v2: 错题本 + 预计算缓存 + 目标追踪
-- =====================================================

-- 错题本核心表
CREATE TABLE IF NOT EXISTS mistake_book_entries (
    id              SERIAL PRIMARY KEY,
    user_id         INT NOT NULL REFERENCES biz_users(id) ON DELETE CASCADE,
    question_id     INT NOT NULL REFERENCES assessment_questions(id),
    subject         TEXT NOT NULL,
    topic           TEXT NOT NULL,
    subtopic        TEXT,
    difficulty      REAL NOT NULL,
    first_wrong_at  TIMESTAMPTZ NOT NULL,
    last_wrong_at   TIMESTAMPTZ NOT NULL,
    wrong_count     INT NOT NULL DEFAULT 1,
    correct_after_wrong INT NOT NULL DEFAULT 0,
    mastery_status  TEXT NOT NULL DEFAULT 'new',
    mastered_at     TIMESTAMPTZ,
    bloom_level     TEXT,
    misconception_ids TEXT[],
    skill_tags      TEXT[],
    last_wrong_answer JSONB,
    correct_answer    JSONB,
    explanation_zh    TEXT,
    explanation_en    TEXT,
    question_stem_zh  TEXT,
    question_stem_en  TEXT,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, question_id)
);
CREATE INDEX IF NOT EXISTS idx_mbe_user ON mistake_book_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_mbe_user_subject ON mistake_book_entries(user_id, subject);
CREATE INDEX IF NOT EXISTS idx_mbe_user_status ON mistake_book_entries(user_id, mastery_status);
CREATE INDEX IF NOT EXISTS idx_mbe_user_subject_topic ON mistake_book_entries(user_id, subject, topic);

-- 预计算缓存表
CREATE TABLE IF NOT EXISTS academic_profile_cache (
    user_id         INT PRIMARY KEY REFERENCES biz_users(id) ON DELETE CASCADE,
    profile_data    JSONB NOT NULL,
    computed_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version         INT NOT NULL DEFAULT 1,
    compute_time_ms INT
);

-- 目标追踪表
CREATE TABLE IF NOT EXISTS goal_snapshots (
    id              SERIAL PRIMARY KEY,
    user_id         INT NOT NULL REFERENCES biz_users(id) ON DELETE CASCADE,
    goal_type       TEXT NOT NULL,
    goal_text       TEXT NOT NULL,
    goal_metadata   JSONB DEFAULT '{}',
    current_value   REAL,
    target_value    REAL,
    gap_pct         REAL,
    status          TEXT DEFAULT 'active',
    source          TEXT DEFAULT 'mem0',
    extracted_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, goal_type, goal_text)
);
CREATE INDEX IF NOT EXISTS idx_gs_user ON goal_snapshots(user_id);

-- student_ability_scores v2 扩展列
ALTER TABLE student_ability_scores ADD COLUMN IF NOT EXISTS total_questions   INT DEFAULT 0;
ALTER TABLE student_ability_scores ADD COLUMN IF NOT EXISTS correct_questions INT DEFAULT 0;
ALTER TABLE student_ability_scores ADD COLUMN IF NOT EXISTS wrong_questions   INT DEFAULT 0;
ALTER TABLE student_ability_scores ADD COLUMN IF NOT EXISTS mastered_mistakes INT DEFAULT 0;
ALTER TABLE student_ability_scores ADD COLUMN IF NOT EXISTS active_mistakes   INT DEFAULT 0;
ALTER TABLE student_ability_scores ADD COLUMN IF NOT EXISTS bloom_mastery     JSONB DEFAULT '{}';
ALTER TABLE student_ability_scores ADD COLUMN IF NOT EXISTS last_computed_at  TIMESTAMPTZ;
