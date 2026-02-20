# BasisPilot 用户账号体系 — 全局设计 & 分阶段实施

## 设计原则

1. **阶段一即可用**：学生、家长、toB 机构三方满足
2. **全局预留**：org_id、角色、关系表结构到位但不强制
3. **向下兼容**：现有 biz_users 平滑迁移，不丢数据
4. **Supabase 原生**：复用 auth.users，业务表补充画像

---

## 全局 ER 图

```
┌─────────────────┐     ┌──────────────────┐     ┌──────────────────────┐
│  organizations   │────<│   org_members    │>────│   biz_users          │
│  (学校/机构)     │     │  (角色+归属)     │     │  (核心用户表)        │
└────────┬────────┘     └──────────────────┘     └──────────┬───────────┘
         │                                                   │
         │                                      ┌────────────┼────────────┐
         │                                      │            │            │
         │                               ┌──────┴─────┐ ┌───┴────┐ ┌────┴──────────┐
         │                               │ student    │ │ parent │ │ learning      │
         │                               │ _profiles  │ │_student│ │ _records      │
         │                               │ (学生画像) │ │_links  │ │ (学习记录)    │
         │                               └────────────┘ └────────┘ └───────────────┘
         │
    ┌────┴──────────┐   ┌──────────────┐   ┌──────────────┐
    │ subscriptions │   │ usage_logs   │   │ purchases    │
    │ (订阅)        │   │ (用量)       │   │ (购买)       │
    └───────────────┘   └──────────────┘   └──────────────┘
```

---

## 阶段划分

| 阶段 | 目标 | 新增表 | 时间 |
|------|------|--------|------|
| **Phase 1** | 学生/家长/机构基础可用 | biz_users 扩展 + organizations + org_members + student_profiles + parent_student_links | 1-2 周 |
| **Phase 2** | 学习数据 + 精细化运营 | learning_records + learning_reports + 配额分组 | 2-4 周 |
| **Phase 3** | 完整多租户 + RLS | Supabase RLS 策略 + 组织级计费 + RBAC 权限 | 4-8 周 |

---

## Phase 1：核心用户体系（立即实施）

### 1.1 biz_users 表扩展

在现有表上 ALTER，不破坏已有数据：

```sql
-- =====================================================
-- Phase 1 迁移脚本：扩展用户体系
-- =====================================================

-- 1) 扩展 biz_users 表
ALTER TABLE biz_users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'student';
    -- student | parent | teacher | admin | staff
ALTER TABLE biz_users ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE biz_users ADD COLUMN IF NOT EXISTS gender TEXT;
    -- male | female | other
ALTER TABLE biz_users ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'zh-CN';
ALTER TABLE biz_users ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active';
    -- active | suspended | deleted
ALTER TABLE biz_users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;
ALTER TABLE biz_users ADD COLUMN IF NOT EXISTS login_count INT NOT NULL DEFAULT 0;
ALTER TABLE biz_users ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
    -- 灵活扩展字段：referral_code, utm_source, device_info...

CREATE INDEX IF NOT EXISTS idx_biz_users_role ON biz_users(role);
CREATE INDEX IF NOT EXISTS idx_biz_users_phone ON biz_users(phone);
```

**字段说明**：

| 字段 | 类型 | 说明 | 阶段 |
|------|------|------|------|
| id | SERIAL | 自增主键 | 已有 |
| supabase_uid | TEXT | Supabase auth.users.id | 已有 |
| wechat_openid | TEXT | 微信 OpenID | 已有 |
| wechat_unionid | TEXT | 微信 UnionID | 已有 |
| phone | TEXT | 手机号 | 已有 |
| nickname | TEXT | 昵称 | 已有 |
| avatar_url | TEXT | 头像 | 已有 |
| **role** | TEXT | 角色：student/parent/teacher/admin/staff | **新增** |
| **email** | TEXT | 邮箱 | **新增** |
| **gender** | TEXT | 性别 | **新增** |
| **locale** | TEXT | 语言偏好 | **新增** |
| **status** | TEXT | 账号状态 | **新增** |
| **last_login_at** | TIMESTAMPTZ | 最近登录 | **新增** |
| **login_count** | INT | 登录次数 | **新增** |
| **metadata** | JSONB | 扩展字段 | **新增** |

### 1.2 organizations 表（学校/机构）

```sql
-- 2) 组织表（学校、培训机构、企业）
CREATE TABLE IF NOT EXISTS organizations (
    id              SERIAL PRIMARY KEY,
    name            TEXT NOT NULL,                -- "贝赛思深圳蛇口校区"
    short_name      TEXT,                         -- "蛇口BASIS"
    type            TEXT NOT NULL DEFAULT 'school',
                    -- school | training | enterprise | personal
    logo_url        TEXT,
    contact_phone   TEXT,
    contact_email   TEXT,
    address         TEXT,
    city            TEXT,                         -- "深圳"
    country         TEXT DEFAULT 'CN',
    plan            TEXT NOT NULL DEFAULT 'free',
                    -- free | institution_basic | institution_pro
    max_members     INT NOT NULL DEFAULT 50,      -- 最大成员数
    status          TEXT NOT NULL DEFAULT 'active',
                    -- active | suspended | trial
    trial_ends_at   TIMESTAMPTZ,
    metadata        JSONB DEFAULT '{}',
                    -- 学校类型、年级范围、课程体系等
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**metadata 示例**（学校型机构）：
```json
{
  "school_system": "BASIS",
  "grade_range": ["G1", "G12"],
  "campus_code": "SZ-SK",
  "curriculum": ["AP", "Honors"],
  "student_count": 800
}
```

### 1.3 org_members 表（成员归属 + 角色）

```sql
-- 3) 组织成员关系表
CREATE TABLE IF NOT EXISTS org_members (
    id              SERIAL PRIMARY KEY,
    org_id          INT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id         INT NOT NULL REFERENCES biz_users(id) ON DELETE CASCADE,
    role            TEXT NOT NULL DEFAULT 'member',
                    -- owner | admin | teacher | student | parent | member
    title           TEXT,                         -- "数学教师" / "G10 家长"
    joined_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status          TEXT NOT NULL DEFAULT 'active',
                    -- active | invited | removed
    invited_by      INT REFERENCES biz_users(id),
    metadata        JSONB DEFAULT '{}',
    UNIQUE(org_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_org_members_org ON org_members(org_id);
CREATE INDEX IF NOT EXISTS idx_org_members_user ON org_members(user_id);
```

**设计要点**：
- 一个用户可属于多个组织（家长同时在两所学校）
- org 内角色独立于全局 role（全局是 parent，org 内可以是 admin）
- 个人用户不强制关联 org（org_members 为空即个人用户）

### 1.4 student_profiles 表（学生画像）

```sql
-- 4) 学生画像表（role=student 的用户专属扩展）
CREATE TABLE IF NOT EXISTS student_profiles (
    id              SERIAL PRIMARY KEY,
    user_id         INT NOT NULL UNIQUE REFERENCES biz_users(id) ON DELETE CASCADE,
    school_name     TEXT,                         -- "BASIS Shenzhen"
    campus          TEXT,                         -- "蛇口" / "福田"
    grade           TEXT,                         -- "G9" / "G10"
    enrollment_year INT,                          -- 入学年份 2024
    graduation_year INT,                          -- 预计毕业年份
    current_gpa     NUMERIC(3,2),                 -- 当前 GPA (0.00-4.00)
    gpa_scale       TEXT DEFAULT '4.0',           -- GPA 制度
    ap_courses      JSONB DEFAULT '[]',           -- ["AP Calc BC", "AP Physics C"]
    honors_courses  JSONB DEFAULT '[]',           -- ["Honors Chemistry"]
    weak_subjects   JSONB DEFAULT '[]',           -- ["数学", "物理"]
    strong_subjects JSONB DEFAULT '[]',           -- ["英语", "历史"]
    academic_status TEXT DEFAULT 'normal',
                    -- normal | watch | probation | dismissed
    target_colleges JSONB DEFAULT '[]',           -- 目标院校
    interests       JSONB DEFAULT '[]',           -- 兴趣特长
    notes           TEXT,                         -- 备注
    metadata        JSONB DEFAULT '{}',
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**设计要点**：
- 与 biz_users 1:1 关系（仅 student 角色有）
- `academic_status` 对应 BASIS 保级机制
- `ap_courses` / `weak_subjects` 直接影响 Agent 路由和个性化回复
- `current_gpa` 用于配额检查中的 probation 触发

### 1.5 parent_student_links 表（家长-学生关联）

```sql
-- 5) 家长-学生绑定关系
CREATE TABLE IF NOT EXISTS parent_student_links (
    id              SERIAL PRIMARY KEY,
    parent_id       INT NOT NULL REFERENCES biz_users(id) ON DELETE CASCADE,
    student_id      INT NOT NULL REFERENCES biz_users(id) ON DELETE CASCADE,
    relationship    TEXT NOT NULL DEFAULT 'parent',
                    -- parent | guardian | tutor | sibling
    is_primary      BOOLEAN NOT NULL DEFAULT TRUE,  -- 主要监护人
    status          TEXT NOT NULL DEFAULT 'active',
                    -- active | pending | revoked
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(parent_id, student_id)
);
CREATE INDEX IF NOT EXISTS idx_parent_student_parent ON parent_student_links(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_student_student ON parent_student_links(student_id);
```

**业务场景**：
- 家长登录后可查看/管理绑定的学生画像
- 家长提问时 Agent 自动引用学生的 grade、GPA、AP 课程等上下文
- 一个学生可被多个家长绑定（爸妈/监护人）
- 一个家长可绑定多个学生（兄弟姐妹）

### 1.6 subscriptions 表扩展

```sql
-- 6) 订阅表扩展：支持组织级订阅
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS org_id INT REFERENCES organizations(id);
    -- NULL = 个人订阅，非 NULL = 组织级订阅
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'self';
    -- self | org_grant | promotion | trial
CREATE INDEX IF NOT EXISTS idx_subscriptions_org ON subscriptions(org_id);
```

**设计要点**：
- `org_id = NULL` → 个人付费用户
- `org_id = 5` → 该订阅来自组织（学校采购，分配给学生/教师）
- `source = org_grant` → 学校统一采购的 VIP 额度

---

## Phase 2：学习数据（2-4 周后）

### 2.1 learning_records 表

```sql
-- 7) 学习记录（与 LangGraph thread 关联）
CREATE TABLE IF NOT EXISTS learning_records (
    id              SERIAL PRIMARY KEY,
    user_id         INT NOT NULL REFERENCES biz_users(id) ON DELETE CASCADE,
    student_id      INT REFERENCES biz_users(id),   -- 家长代问时记录学生 ID
    thread_id       TEXT,                            -- LangGraph thread ID
    agent_name      TEXT,                            -- 使用的 Agent
    subject         TEXT,                            -- 学科分类
    topic           TEXT,                            -- 话题摘要
    difficulty      TEXT,                            -- easy | medium | hard
    satisfaction    INT,                             -- 1-5 用户评分
    message_count   INT DEFAULT 0,                   -- 该次对话消息数
    duration_secs   INT,                             -- 对话持续秒数
    metadata        JSONB DEFAULT '{}',
                    -- 具体问题、知识点标签、AI 输出摘要等
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_learning_records_user ON learning_records(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_records_student ON learning_records(student_id);
CREATE INDEX IF NOT EXISTS idx_learning_records_subject ON learning_records(subject);
```

### 2.2 learning_reports 表

```sql
-- 8) 学习报告（周报/月报/学期报告）
CREATE TABLE IF NOT EXISTS learning_reports (
    id              SERIAL PRIMARY KEY,
    user_id         INT NOT NULL REFERENCES biz_users(id) ON DELETE CASCADE,
    student_id      INT REFERENCES biz_users(id),
    report_type     TEXT NOT NULL,                   -- weekly | monthly | semester | assessment
    period_start    DATE NOT NULL,
    period_end      DATE NOT NULL,
    title           TEXT,
    content         JSONB NOT NULL,                  -- 结构化报告内容
                    -- { summary, subjects: [{name, score, trend, suggestions}], recommendations }
    generated_by    TEXT DEFAULT 'ai',               -- ai | manual
    status          TEXT DEFAULT 'draft',            -- draft | published | archived
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_learning_reports_student ON learning_reports(student_id);
```

---

## Phase 3：完整多租户 + RLS（4-8 周后）

### 3.1 Supabase RLS 策略

```sql
-- 9) RLS 策略（在 Supabase Dashboard 或迁移脚本中执行）

-- 启用 RLS
ALTER TABLE biz_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_student_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_members ENABLE ROW LEVEL SECURITY;

-- 用户只能看到自己的数据
CREATE POLICY "Users can view own data" ON biz_users
    FOR SELECT USING (supabase_uid = auth.uid()::text);

-- 家长可查看绑定学生的画像
CREATE POLICY "Parents can view linked students" ON student_profiles
    FOR SELECT USING (
        user_id IN (
            SELECT student_id FROM parent_student_links
            WHERE parent_id = (SELECT id FROM biz_users WHERE supabase_uid = auth.uid()::text)
        )
        OR user_id = (SELECT id FROM biz_users WHERE supabase_uid = auth.uid()::text)
    );

-- 组织管理员可查看组织内所有成员
CREATE POLICY "Org admins can view members" ON org_members
    FOR SELECT USING (
        org_id IN (
            SELECT org_id FROM org_members
            WHERE user_id = (SELECT id FROM biz_users WHERE supabase_uid = auth.uid()::text)
            AND role IN ('owner', 'admin')
        )
    );
```

### 3.2 组织级订阅计费

```sql
-- 10) 组织级配额池
CREATE TABLE IF NOT EXISTS org_quotas (
    id              SERIAL PRIMARY KEY,
    org_id          INT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    quota_type      TEXT NOT NULL,                   -- daily_messages | reports | agents
    total_limit     INT NOT NULL,                    -- 组织总额度
    used_today      INT NOT NULL DEFAULT 0,
    reset_at        TIMESTAMPTZ,                     -- 下次重置时间
    UNIQUE(org_id, quota_type)
);
```

### 3.3 RBAC 权限表

```sql
-- 11) 权限定义
CREATE TABLE IF NOT EXISTS permissions (
    id              SERIAL PRIMARY KEY,
    code            TEXT NOT NULL UNIQUE,             -- "student:view" "report:generate"
    name            TEXT NOT NULL,
    category        TEXT                              -- user | content | billing | admin
);

CREATE TABLE IF NOT EXISTS role_permissions (
    role            TEXT NOT NULL,                     -- owner | admin | teacher | student | parent
    permission_code TEXT NOT NULL REFERENCES permissions(code),
    PRIMARY KEY (role, permission_code)
);

-- 预置权限
INSERT INTO permissions (code, name, category) VALUES
    ('chat:use',           '使用对话',         'content'),
    ('student:view_own',   '查看自己画像',     'user'),
    ('student:view_linked','查看绑定学生',     'user'),
    ('student:edit_own',   '编辑自己画像',     'user'),
    ('report:view',        '查看报告',         'content'),
    ('report:generate',    '生成报告',         'content'),
    ('org:view',           '查看组织信息',     'admin'),
    ('org:manage_members', '管理组织成员',     'admin'),
    ('org:billing',        '管理组织账单',     'billing'),
    ('admin:all',          '超级管理员',       'admin')
ON CONFLICT DO NOTHING;
```

---

## 用户注册 & 角色识别流程

### 阶段一流程（简单高效）

```
用户首次登录（手机/微信）
    │
    ├─ 已有 biz_users 记录？
    │   ├─ 是 → 正常登录，返回 token
    │   └─ 否 → 创建 biz_users（role 默认 'student'）
    │
    └─ 首次进入应用
        │
        ▼
    ┌──────────────────────────────────┐
    │  角色选择浮层（仅首次）          │
    │                                  │
    │  ┌────────┐ ┌────────┐ ┌──────┐ │
    │  │👨‍🎓 学生 │ │👨‍👩‍👧 家长 │ │👩‍🏫 教师│ │
    │  └────────┘ └────────┘ └──────┘ │
    │                                  │
    │  选择后更新 biz_users.role       │
    │  + 跳转对应的画像补全页面        │
    └──────────────────────────────────┘
        │
        ├─ 学生 → 填写 school/grade/AP courses
        │         → 创建 student_profiles 记录
        │
        ├─ 家长 → 填写孩子信息 或 输入绑定码
        │         → 创建 parent_student_links
        │
        └─ 教师/机构 → 填写学校/机构信息
                      → 创建或加入 organizations
```

### toB 机构入驻流程

```
机构管理员注册
    │
    ▼
创建 organizations 记录
    │
    ▼
选择订阅方案 (institution_basic / institution_pro)
    │
    ▼
邀请成员（批量导入手机号 / 邀请链接）
    │
    ├─ 学生收到邀请 → 注册 → 自动 org_members.role = 'student'
    ├─ 家长收到邀请 → 注册 → 自动 org_members.role = 'parent'
    └─ 教师收到邀请 → 注册 → 自动 org_members.role = 'teacher'
    │
    ▼
组织级订阅分配给所有成员
```

---

## API 变更清单

### 阶段一新增 API

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/user/role` | PUT | 设置用户角色（首次选择） |
| `/api/user/profile` | GET/PUT | 获取/更新用户画像 |
| `/api/student/profile` | GET/PUT | 学生画像 CRUD |
| `/api/parent/links` | GET/POST/DELETE | 家长-学生绑定管理 |
| `/api/parent/students` | GET | 家长查看所有绑定学生 |

### 阶段一修改 API

| 端点 | 变更 |
|------|------|
| `/api/user/me` | 响应增加 role, student_profile, linked_students |
| `/api/auth/sync` | 创建用户时设置默认 role |
| `/api/quota/check` | 检查组织级配额（如有 org_id） |

### 阶段二新增 API

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/org` | POST | 创建组织 |
| `/api/org/{id}` | GET/PUT | 组织信息管理 |
| `/api/org/{id}/members` | GET/POST/DELETE | 成员管理 |
| `/api/org/{id}/invite` | POST | 生成邀请链接/批量邀请 |
| `/api/reports` | GET/POST | 学习报告管理 |
| `/api/learning/summary` | GET | 学习数据统计 |

---

## 前端 UserProfile 接口变更

```typescript
// Phase 1 — 扩展后的用户信息
interface UserProfile {
  user: {
    id: number
    nickname: string
    avatar_url: string | null
    phone: string | null
    email: string | null
    role: 'student' | 'parent' | 'teacher' | 'admin' | 'staff'
    status: 'active' | 'suspended'
    login_count: number
    last_login_at: string | null
  }
  subscription: SubscriptionInfo
  quota: QuotaInfo

  // 学生角色专属
  student_profile?: {
    school_name: string
    campus: string
    grade: string
    current_gpa: number | null
    ap_courses: string[]
    weak_subjects: string[]
    academic_status: 'normal' | 'watch' | 'probation'
  }

  // 家长角色专属
  linked_students?: {
    student_id: number
    nickname: string
    grade: string
    school_name: string
    current_gpa: number | null
    academic_status: string
    relationship: string
  }[]

  // 组织信息（如有）
  organizations?: {
    org_id: number
    name: string
    role: string  // 在该组织内的角色
  }[]
}
```

---

## Agent 上下文增强

学生画像数据应注入到 Agent 的对话上下文中：

```python
# 在 LangGraph config 或 system message 中注入
student_context = f"""
## 当前学生档案
- 学校：{profile.school_name} ({profile.campus})
- 年级：{profile.grade}
- 当前 GPA：{profile.current_gpa}
- AP 课程：{', '.join(profile.ap_courses)}
- 薄弱科目：{', '.join(profile.weak_subjects)}
- 学业状态：{profile.academic_status}
"""
```

这样 Agent 回答时自动具备个性化能力，不需要每次重新问用户基本信息。

---

## 迁移兼容性

### 已有数据处理

```sql
-- 已有用户默认设为 student（最保守的选择）
-- 用户首次打开新版应用时，弹出角色选择浮层修改
UPDATE biz_users SET role = 'student' WHERE role IS NULL;
```

### 已有订阅处理

```sql
-- 已有订阅 org_id 为 NULL（个人订阅），无需迁移
-- source 默认 'self'
UPDATE subscriptions SET source = 'self' WHERE source IS NULL;
```

---

## 实施优先级

### 第 1 周
- [ ] 执行 Phase 1 SQL 迁移脚本
- [ ] 扩展 db.py CRUD 函数
- [ ] 新增 `/api/user/role`、`/api/student/profile` API
- [ ] 修改 `/api/user/me` 返回扩展信息

### 第 2 周
- [ ] 前端角色选择浮层
- [ ] 学生画像填写/编辑页面
- [ ] 家长绑定学生流程
- [ ] Agent 上下文注入学生画像

### 第 3-4 周（Phase 2）
- [ ] organizations + org_members 表
- [ ] 机构管理后台 API
- [ ] 邀请成员流程
- [ ] learning_records 记录

### 第 5-8 周（Phase 3）
- [ ] Supabase RLS 策略
- [ ] 组织级配额池
- [ ] RBAC 权限系统
- [ ] 学习报告生成
