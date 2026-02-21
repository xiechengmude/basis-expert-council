---
title: BasisPilot 代码库索引目录
description: 核心模块 × 架构分层 × 文件路径 — 一图定位所有代码
author: Claude Opus 4.6
version: 1.0.0
created: 2026-02-21T03:45:00+08:00
updated: 2026-02-21T03:45:00+08:00
git_commit: b04d5bb
git_hash: b04d5bb14278731d90d6d3d22d32be468bb74232
git_branch: main
tags: [architecture, index, reference, fullstack]
project: basis-expert-council
stack: LangGraph + FastAPI + Next.js + PostgreSQL + Redis + Qdrant
---

# BasisPilot 代码库索引目录

> 核心模块 × 架构分层 × 文件路径 — 一图定位所有代码

---

## 一、项目根目录结构

```
basis-expert-council/
├── AGENTS.md                          # 主 Agent 人格 + 调度规则
├── graph.py                           # LangGraph Server 入口（暴露 agent 变量）
├── langgraph.json                     # LangGraph Server 配置
├── pyproject.toml                     # Python 依赖 + 构建配置
├── .env.example                       # 环境变量模板
│
├── src/basis_expert_council/          # ★ Python 后端核心
├── agents/                            # ★ 6 个子代理系统提示
├── skills/                            # ★ 11 个技能模块
├── knowledge/                         # 知识库文件
│
├── frontend/                          # ★ Next.js 前端
├── deploy/                            # ★ Docker 部署配置
├── tests/                             # 测试文件
├── docs/                              # 文档
└── debug/skills/                      # 开发调试技能文档
```

---

## 二、后端核心模块

### 2.1 Agent 系统（LangGraph / DeepAgents）

| 文件 | 职责 | 关键接口 |
|------|------|---------|
| `graph.py` | LangGraph Server 入口 | `agent = create_basis_expert_agent()` |
| `src/.../agent.py` | Agent 工厂 + 模型配置 + monkey patch | `create_basis_expert_agent()` |
| `AGENTS.md` | 主 Agent 人格定义 + subagent 调度规则 | — |

**模型配置环境变量：**
```
BASIS_LEAD_MODEL          → 主模型 (default: openai:z-ai/glm-5)
BASIS_SUBAGENT_MODEL      → 子代理默认模型 (default: openai:minimax/minimax-m2.5)
BASIS_MATH_MODEL          → 数学专家单独覆盖
BASIS_SCIENCE_MODEL       → 科学专家单独覆盖
BASIS_HUMANITIES_MODEL    → 人文专家单独覆盖
BASIS_CURRICULUM_MODEL    → 课程顾问单独覆盖
BASIS_BUSINESS_MODEL      → 商务顾问单独覆盖
BASIS_PROBATION_MODEL     → 保级顾问单独覆盖
```

### 2.2 子代理（6 个）

| 代理名 | 系统提示文件 | 职责 |
|--------|-------------|------|
| `math-expert` | `agents/math-expert/AGENTS.md` | 数学辅导 / AP Calculus / Statistics |
| `science-expert` | `agents/science-expert/AGENTS.md` | 物理化学生物 / Lab Report / AP Science |
| `humanities-expert` | `agents/humanities-expert/AGENTS.md` | 英语阅读写作 / 历史 / Essay / DBQ |
| `curriculum-advisor` | `agents/curriculum-advisor/AGENTS.md` | AP 选课 / 升学规划 / GPA 管理 |
| `business-advisor` | `agents/business-advisor/AGENTS.md` | 市场分析 / 销售 / B2B 合作 |
| `probation-advisor` | `agents/probation-advisor/AGENTS.md` | Academic Probation 保级方案 |

### 2.3 技能模块（11 个）

```
skills/
├── math-tutoring/          # 数学辅导
├── science-tutoring/       # 科学辅导
├── humanities-tutoring/    # 人文辅导
├── ap-exam-prep/           # AP 备考
├── new-student-onboarding/ # 新生衔接
├── lesson-planning/        # 教案生成
├── college-planning/       # 升学规划
├── academic-assessment/    # 学业评估
├── parent-communication/   # 家长沟通
├── study-plan/             # 学习计划
└── probation-recovery/     # 保级恢复
```

每个技能目录结构：`SKILL.md`（技能定义）+ 知识文件

### 2.4 工具系统

| 文件 | 工具名 | 类型 | 职责 |
|------|--------|------|------|
| `src/.../memory_tools.py` | `remember_fact` | LangGraph Tool | 存储用户信息到 Mem0 |
| `src/.../memory_tools.py` | `recall_memories` | LangGraph Tool | 按查询检索记忆 |
| `src/.../memory_tools.py` | `get_user_memory_profile` | LangGraph Tool | 获取用户完整记忆档案 |
| `src/.../memory_tools.py` | `forget_memory` | LangGraph Tool | 删除指定记忆 |
| `src/.../a2ui_tool.py` | `a2ui_render` | LangGraph Tool | HITL 交互 UI 渲染（interrupt） |

**Memory 工具数据流：**
```
Frontend user_id → config.configurable.user_id → _extract_user_id()
→ user_id_to_mem0() → "basis_user_{uuid}" → Mem0 SDK → Qdrant
```

### 2.5 记忆系统（Mem0 + Qdrant）

| 文件 | 职责 |
|------|------|
| `src/.../memory.py` | Mem0 单例初始化 + 配置 |
| `src/.../memory_tools.py` | 4 个 LangGraph memory tools |

**配置：**
```
MEM0_QDRANT_HOST / MEM0_QDRANT_PORT   → Qdrant 地址 (default: basis-qdrant:6333)
MEM0_QDRANT_COLLECTION                 → Collection 名 (basispilot_memories)
MEM0_LLM_MODEL                        → 记忆抽取 LLM
MEM0_EMBEDDING_MODEL                   → 向量化模型
EMBEDDING_API_KEY / EMBEDDING_BASE_URL → Embedding API 凭证
```

**记忆分类：** `tutoring` / `college_planning` / `onboarding` / `exam_prep` / `grade` / `assessment` / `preference` / `goal`

### 2.6 Business API（FastAPI）

| 文件 | 职责 |
|------|------|
| `src/.../server.py` | FastAPI 主入口 (port 5096) |
| `src/.../auth.py` | WeChat OAuth + JWT 签发/验证 |
| `src/.../sms.py` | 阿里云 SMS + 验证码内存存储 |
| `src/.../db.py` | asyncpg 连接池 + 全部 CRUD 操作 |

**API 端点清单：**

| 路径 | 方法 | 功能 | 需要 Auth |
|------|------|------|----------|
| `/ok` | GET | 健康检查 | ✗ |
| `/api/pricing` | GET | 计划定价 | ✗ |
| `/api/auth/send-code` | POST | 发送 SMS 验证码 | ✗ |
| `/api/auth/phone-login` | POST | 手机号+验证码登录 | ✗ |
| `/api/auth/sync` | POST | Supabase→业务DB同步 | ✗ |
| `/api/auth/wechat/url` | GET | WeChat OAuth URL | ✗ |
| `/api/auth/wechat/callback` | POST | WeChat 回调 | ✗ |
| `/api/user/me` | GET | 当前用户信息 | ✓ |
| `/api/user/usage` | GET | 使用量统计 | ✓ |
| `/api/user/role` | GET | 用户角色 | ✓ |
| `/api/user/complete-kyc` | POST | 完成 KYC | ✓ |
| `/api/student/profile` | GET/PUT | 学生档案 | ✓ |
| `/api/parent/links` | GET/POST/DELETE | 家长-学生关联 | ✓ |
| `/api/quota/check` | POST | 配额检查 | ✓ |

### 2.7 数据库层

| 文件 | 职责 |
|------|------|
| `src/.../db.py` | asyncpg 连接池 + Schema + CRUD |
| `deploy/init.sql` | Docker 初始化 SQL |

**业务表结构：**

| 表名 | 用途 | 关键字段 |
|------|------|---------|
| `biz_users` | 用户主表 | supabase_uid, phone, wechat_openid, role, display_name |
| `student_profiles` | 学生档案 | user_id, school, grade, gpa, ap_courses (JSONB), weak_subjects |
| `subscriptions` | 订阅计划 | user_id, plan (free/basic/premium/vip), status, expires_at |
| `usage_logs` | 每日用量 | user_id, log_date, used_count, agent_calls (JSONB) |
| `parent_student_links` | 家庭关系 | parent_id, student_id, relationship |
| `purchases` | 一次性购买 | user_id, product_id, amount, status |

**计划配额：**

| Plan | 每日消息 | 可用代理 | 月报告 |
|------|---------|---------|--------|
| free | 30 | math, science | 0 |
| basic | 50 | 全部 5 个 | 1 |
| premium | ∞ | 全部 5 个 | 6 |
| vip | ∞ | 全部 5 个 | 30 |

---

## 三、前端核心模块

### 3.1 App Router 页面

| 路径 | 文件 | 职责 |
|------|------|------|
| `/` | `src/app/page.tsx` | 主页（Landing/Chat 条件渲染） |
| `/login` | `src/app/login/page.tsx` | SMS + WeChat 登录 |
| `/login/wechat-complete` | `src/app/login/wechat-complete/page.tsx` | WeChat 回调 |
| `/onboarding` | `src/app/onboarding/page.tsx` | 新用户 KYC |
| `/landing` | `src/app/landing/page.tsx` | 营销落地页 |
| `/a2ui-demo` | `src/app/a2ui-demo/page.tsx` | A2UI 组件演示 |

### 3.2 核心组件

| 组件 | 文件 | 职责 |
|------|------|------|
| `ChatInterface` | `src/app/components/ChatInterface.tsx` | 聊天主界面（消息列表+输入框） |
| `ChatMessage` | `src/app/components/ChatMessage.tsx` | 单条消息渲染 + hidden 工具聚合指示器 |
| `ToolCallBox` | `src/app/components/ToolCallBox.tsx` | 工具调用展示（friendly/原始） |
| `SubAgentIndicator` | `src/app/components/SubAgentIndicator.tsx` | 子代理状态指示（中文名+图标） |
| `MarkdownContent` | `src/app/components/MarkdownContent.tsx` | Markdown 渲染 |
| `ToolApprovalInterrupt` | `src/app/components/ToolApprovalInterrupt.tsx` | HITL 工具审批 UI |
| `WelcomeScreen` | `src/app/components/WelcomeScreen.tsx` | 空对话欢迎页 |
| `ScenarioFormModal` | `src/app/components/ScenarioFormModal.tsx` | 场景化输入表单 |
| `ThreadList` | `src/app/components/ThreadList.tsx` | 会话历史列表 |

### 3.3 Hooks

| Hook | 文件 | 职责 |
|------|------|------|
| `useChat` | `src/app/hooks/useChat.ts` | LangGraph 流式对话核心 Hook |
| `useThreads` | `src/app/hooks/useThreads.ts` | 会话列表管理 |
| `useUser` | `src/app/hooks/useUser.ts` | 用户信息/配额/订阅 |

### 3.4 A2UI 系统

```
src/app/a2ui/
├── index.ts              # 导出注册表
├── types.ts              # TypeScript 类型定义
├── processor.ts          # JSONL 解析 → React 组件
├── context.tsx           # Action handler context
└── components/
    ├── A2UISurface.tsx   # 顶层容器（解析+渲染）
    ├── A2UIButton.tsx    # 按钮
    ├── A2UIText.tsx      # 文本/Markdown
    ├── A2UICheckbox.tsx  # 复选框
    ├── A2UICard.tsx      # 卡片
    ├── A2UIMultipleChoice.tsx  # 选择题
    ├── A2UIImage.tsx     # 图片
    ├── A2UIRow.tsx       # 行布局
    ├── A2UIColumn.tsx    # 列布局
    ├── A2UIDivider.tsx   # 分割线
    └── A2UIList.tsx      # 列表
```

**A2UI 数据流：**
```
Agent: a2ui_render(jsonl) → interrupt()
→ Frontend: SSE 收到 interrupt 事件
→ A2UISurface 解析 JSONL → 渲染 React 组件
→ 用户交互 → onAction callback
→ resumeInterrupt(action) → Agent 继续执行
```

### 3.5 配置与 Auth

| 文件 | 职责 |
|------|------|
| `src/lib/config.ts` | LangGraph 连接配置（localStorage 持久） |
| `src/lib/supabase/client.ts` | Supabase 浏览器端 Client |
| `src/lib/supabase/server.ts` | Supabase 服务端 Client |
| `src/providers/AuthProvider.tsx` | Supabase Auth Context |
| `src/providers/KycGuard.tsx` | KYC 完成检查守卫 |
| `src/providers/ChatProvider.tsx` | Chat Context |
| `src/middleware.ts` | Auth 中间件（未登录→重定向 /login） |
| `src/app/config/toolDisplayConfig.ts` | 工具展示策略（hidden/friendly/special + 开发者模式） |

### 3.6 国际化

```
src/i18n/
├── index.tsx             # I18nProvider + useTranslation hook
└── translations/
    └── common.ts         # 多语言翻译（zh/en/zhtw）

src/app/landing/
└── i18n.ts               # 落地页 10 语言翻译
```

### 3.7 API Routes（Next.js Server）

| 路由 | 文件 | 职责 |
|------|------|------|
| `/api/auth/send-code` | `src/app/api/auth/send-code/route.ts` | 转发 SMS 到 Business API |
| `/api/auth/phone-login` | `src/app/api/auth/phone-login/route.ts` | 转发登录到 Business API |
| `/api/auth/google/callback` | `src/app/api/auth/google/callback/route.ts` | Google OAuth 回调 |
| `/api/auth/wechat/callback` | `src/app/api/auth/wechat/callback/route.ts` | WeChat OAuth 回调 |

---

## 四、部署模块

### 4.1 Docker 配置

| 文件 | 用途 |
|------|------|
| `deploy/Dockerfile` | LangGraph Agent 镜像 (base: langgraph-api:0.5.42-py3.12) |
| `deploy/Dockerfile.api` | Business API 镜像 (base: python:3.12-slim) |
| `deploy/Dockerfile.frontend` | Next.js Frontend 镜像 (base: node:22-alpine, 多阶段) |
| `deploy/docker-compose.local.yml` | 本地全栈 6 容器编排 |
| `deploy/docker-compose.dev.yml` | 开发服务器部署 |
| `deploy/init.sql` | 数据库初始化 SQL |

### 4.2 部署脚本

| 文件 | 用途 |
|------|------|
| `deploy/scripts/start_local.sh` | 本地一键启动 |
| `deploy/scripts/deploy_dev.sh` | 开发服务器一键部署 |

### 4.3 静态资产

| 文件 | 用途 |
|------|------|
| `frontend/public/logo-mark.svg` | Logo 图标 (Blackletter Bi) |
| `frontend/public/logo-mark-filled.svg` | Logo 填充版 (apple-touch-icon) |
| `frontend/public/logo-full.svg` | 完整 Logo (图标+文字 BasisPilot 贝领) |
| `frontend/public/logo-full-white.svg` | 完整 Logo 白色版 (深色背景) |
| `frontend/public/favicon.svg` | 浏览器标签页图标 |
| `frontend/public/manifest.json` | PWA Web App Manifest |

---

## 五、环境变量完整清单

### 必需

| 变量 | 用途 | 设置位置 |
|------|------|---------|
| `OPENAI_API_KEY` | LLM API 密钥 | `.env` |
| `OPENAI_BASE_URL` | LLM API 网关地址 | `.env` |
| `LANGSMITH_API_KEY` | LangGraph Server License | `.env` |
| `BASIS_JWT_SECRET` | Business API JWT 签名密钥 | `.env` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | `.env` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | `.env` |

### 可选

| 变量 | 用途 | 默认值 |
|------|------|--------|
| `BASIS_LEAD_MODEL` | 主模型 | `openai:z-ai/glm-5` |
| `BASIS_SUBAGENT_MODEL` | 子代理模型 | `openai:minimax/minimax-m2.5` |
| `LANGCHAIN_TRACING_V2` | LangSmith 追踪 | `false` |
| `NEXT_PUBLIC_DEV_TOOLS` | 前端开发者模式 | `false` |
| `WECHAT_APP_ID` | 微信 H5 OAuth | — |
| `WECHAT_APP_SECRET` | 微信 H5 OAuth | — |
| `ALIYUN_ACCESS_KEY_ID` | 阿里云 SMS | — |
| `MEM0_LLM_MODEL` | 记忆抽取模型 | `Pro/deepseek-ai/DeepSeek-V3.2` |
| `MEM0_EMBEDDING_MODEL` | 向量化模型 | `Qwen/Qwen3-Embedding-4B` |

---

## 六、数据流全景

### 用户消息处理链

```
用户输入 → Frontend useChat()
  → POST /runs/stream (LangGraph Agent :5095)
    → Lead Agent 判断意图
      → 直接回复 / 调度 Subagent / 调用 Memory Tool / 触发 A2UI
    → SSE 流式返回
  → ChatMessage 渲染（hidden 工具聚合 / friendly 友好化 / subagent 中文名）
```

### Auth 认证链

```
用户手机号 → Frontend /login
  → POST /api/auth/send-code (Next.js API Route → Business API)
  → POST /api/auth/phone-login (Business API → Supabase Admin)
  → POST /api/auth/sync (Business API → biz_users + subscriptions)
  → 返回 Supabase session + BASIS JWT
  → Frontend 存储 cookie + localStorage
  → middleware.ts 检查 session → 放行或重定向
```

### 配额检查链

```
用户发消息前 → Frontend 调用 /api/quota/check
  → Business API 查 subscriptions + usage_logs
  → 返回 {allowed, plan, daily_limit, used_today, remaining}
  → allowed=false → 前端拦截，显示升级提示
  → allowed=true → increment_usage() → 发送到 Agent
```
