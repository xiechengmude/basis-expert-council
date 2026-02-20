-- =============================================================================
-- BasisPilot (贝领) — Phase 1 用户体系：个人 toC 可用
-- 在现有 biz_users 基础上扩展角色 + 学生画像 + 家长绑定
-- =============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- 1) 扩展 biz_users：加角色和基础画像字段
-- ---------------------------------------------------------------------------

ALTER TABLE biz_users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'student';
    -- student | parent | teacher
ALTER TABLE biz_users ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE biz_users ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active';
    -- active | suspended
ALTER TABLE biz_users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;
ALTER TABLE biz_users ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_biz_users_role ON biz_users(role);
CREATE INDEX IF NOT EXISTS idx_biz_users_phone ON biz_users(phone);

-- ---------------------------------------------------------------------------
-- 2) 学生画像（role=student 的用户才需要）
-- ---------------------------------------------------------------------------

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
    academic_status TEXT DEFAULT 'normal',         -- normal | watch | probation
    notes           TEXT,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 3) 家长-学生绑定
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS parent_student_links (
    id              SERIAL PRIMARY KEY,
    parent_id       INT NOT NULL REFERENCES biz_users(id) ON DELETE CASCADE,
    student_id      INT NOT NULL REFERENCES biz_users(id) ON DELETE CASCADE,
    relationship    TEXT NOT NULL DEFAULT 'parent',
                    -- parent | guardian | tutor
    status          TEXT NOT NULL DEFAULT 'active',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(parent_id, student_id)
);
CREATE INDEX IF NOT EXISTS idx_psl_parent ON parent_student_links(parent_id);
CREATE INDEX IF NOT EXISTS idx_psl_student ON parent_student_links(student_id);

COMMIT;
