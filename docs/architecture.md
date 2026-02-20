# BasisPilot 贝领 — 系统架构文档

> 更新: 2026-02-21 | 版本: Phase 1 MVP

## 概述

BasisPilot（贝领）是基于 DeepAgents / LangGraph 架构的多智能体 AI 教育领航平台，为贝赛思 (BASIS) 教育体系提供课程同步辅导和咨询服务。

## 技术栈

| 层 | 技术 | 说明 |
|---|------|------|
| 前端 | Next.js 16, React 19, Tailwind CSS | SSR + 客户端混合，端口 8015 |
| 认证 | Supabase Auth + Aliyun SMS | 手机验证码登录 + 微信 H5 OAuth |
| Agent 服务 | LangGraph Server 0.5.42 | `langgraph up` Docker 模式，端口 5095 |
| Agent 框架 | DeepAgents 0.4.1 + LangGraph 1.0.9 | 多智能体编排，Middleware 管线 |
| 业务 API | FastAPI (独立服务) | 认证/用户/配额/定价，端口 5096 |
| 数据库 | PostgreSQL 16 | LangGraph checkpoint + 业务表 |
| 缓存 | Redis 7 | LangGraph streaming Pub-Sub |
| 向量存储 | Qdrant 1.13 | Mem0 用户记忆向量化 |
| LLM 网关 | LiteLLM Proxy | `http://150.109.16.195:8600/v1` |
| 追踪 | LangSmith | 项目: `basis-expert-council` |

## 全栈架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                        用户浏览器                                │
│                   http://localhost:8015                          │
└───────────┬──────────────────────────┬──────────────────────────┘
            │ SSR / SMS 验证码          │ 客户端 JS
            │ (Server Action)          │ (LangGraph SDK)
            ▼                          ▼
┌──────────────────────┐    ┌──────────────────────────┐
│  basis-frontend      │    │  basis-agent             │
│  Next.js 16 SSR      │    │  LangGraph Server        │
│  :8015               │    │  :5095                   │
│                      │    │                          │
│  · 登录页 (SMS/微信)  │    │  · DeepAgents 框架       │
│  · WelcomeScreen     │    │  · 6 SubAgents           │
│  · ChatInterface     │    │  · 11 Skills             │
│  · Supabase Auth     │    │  · Mem0 记忆系统          │
│  · Aliyun SMS API    │    │  · LLM via LiteLLM Proxy │
└──────────────────────┘    └─────┬────────┬───────────┘
                                  │        │
                                  │ DB     │ 向量
                                  ▼        ▼
┌──────────────────────┐    ┌──────────────────────────┐
│  basis-postgres      │    │  basis-qdrant            │
│  PostgreSQL 16       │    │  Qdrant v1.13            │
│  :5436 → 5432        │    │  :6333 (HTTP)            │
│                      │    │  :6334 (gRPC)            │
│  · LangGraph 表      │    │  · Mem0 向量存储          │
│  · biz_users         │    │  · basispilot_memories   │
│  · subscriptions     │    └──────────────────────────┘
│  · usage_logs        │
│  · student_profiles  │    ┌──────────────────────────┐
│  · parent_student_   │    │  basis-redis             │
│    links             │    │  Redis 7                 │
└──────────────────────┘    │  :6395                   │
                            │  · Streaming Pub-Sub     │
┌──────────────────────┐    └──────────────────────────┘
│  basis-api           │
│  FastAPI (Business)  │
│  :5096               │
│                      │
│  · 认证 (JWT/微信)    │
│  · 用户管理           │
│  · 配额检查           │
│  · 定价/订阅          │
└──────────────────────┘
```

## Docker 容器清单

| 容器名 | 镜像/构建 | 端口 (宿主→容器) | 职责 | 依赖 |
|--------|----------|-----------------|------|------|
| `basisPilot-postgres` | `postgres:16-alpine` | `5436 → 5432` | LangGraph checkpoint + 业务数据 | 无 |
| `basisPilot-redis` | `redis:7-alpine` | `6395 → 6395` | LangGraph streaming Pub-Sub | 无 |
| `basisPilot-qdrant` | `qdrant/qdrant:v1.13.2` | `6333`, `6334` | Mem0 向量存储 (用户记忆) | 无 |
| `basisPilot-agent` | `deploy/Dockerfile` | `5095 → 5095` | LangGraph Agent — DeepAgents, 6 SubAgents, 11 Skills | postgres, redis, qdrant |
| `basisPilot-api` | `deploy/Dockerfile.api` | `5096 → 5096` | 业务 API — 认证/JWT/微信/用户/配额/定价 | postgres |
| `basisPilot-frontend` | `deploy/Dockerfile.frontend` | `8015 → 8015` | 前端 SSR — 登录/聊天/WelcomeScreen/SMS | agent (healthy) |

## Agent 架构

```
graph.py:agent
  └─ create_basis_expert_agent()           # agent.py
      └─ create_deep_agent(model_instance) # DeepAgents 框架
          │
          ├─ Middleware 管线:
          │   MemoryMiddleware     → 加载 AGENTS.md 系统 prompt
          │   SkillsMiddleware     → 加载 skills/ 下 11 个 Skill
          │   FilesystemMiddleware → 文件操作 (ls/read/write/edit/glob/grep)
          │   SubAgentMiddleware   → 创建 task 工具，分派子 Agent
          │   SummarizationMiddleware → 上下文压缩
          │   PatchToolCallsMiddleware → 修复 tool call 格式
          │
          ├─ Lead Agent (minimax-m2.5)
          │   内置工具: write_todos, read_file, edit_file, ls, glob, grep, task
          │
          └─ SubAgents (通过 task 工具调用):
              ├─ math-expert         数学学科专家
              ├─ science-expert      科学学科专家
              ├─ humanities-expert   人文学科专家
              ├─ curriculum-advisor  课程规划顾问
              ├─ business-advisor    商务谈判专家
              ├─ probation-advisor   Academic Probation 保级专家
              └─ general-purpose     通用 Agent (DeepAgents 内置)
```

### Skills vs SubAgents — 调用机制对比

Skills 和 SubAgents 是 DeepAgents 框架的两种核心能力扩展机制，调用方式完全不同：

| | SkillsMiddleware | SubAgentMiddleware |
|---|---|---|
| **本质** | 知识注入（提示词） | 工具注册（tool_call） |
| **注册方式** | 扫描 `skills/` 目录，将 name + description 注入 system prompt | 初始化时通过 `_build_task_tool()` 创建 `task` 工具 |
| **触发方式** | 模型看到 prompt 后主动调用 `read_file("skills/.../SKILL.md")` | 模型输出 `task(subagent_type="...", description="...")` |
| **执行方式** | 读取文本指令后，主 Agent 自己按指令执行 | 启动独立子 Agent graph，有自己的消息历史和工具 |
| **独立上下文** | 无 — 共享主 Agent 上下文 | 有 — 子 Agent 有独立的对话历史 |
| **适合场景** | 模板、流程指引、知识参考、格式规范 | 需要独立推理的专业领域任务 |

#### SkillsMiddleware 执行流程

```
1. before_agent    扫描 skills/ 目录，加载所有 SKILL.md 的 frontmatter
                   ↓
2. wrap_model_call 每次调用 LLM 前，往 system prompt 注入技能摘要:
                   "Available Skills:
                    - probation-rescue: Academic Probation 保级恢复方案
                      -> Read /app/skills/probation-rescue/SKILL.md for full instructions
                    - student-assessment: 学生水平评估
                      -> Read /app/skills/student-assessment/SKILL.md for full instructions
                    ..."
                   ↓
3. 模型自行决定    看到 prompt 后，如果判断相关，调用 read_file() 读取完整 SKILL.md
```

#### SubAgentMiddleware 执行流程

```
1. __init__        _build_task_tool() 创建 task 工具 → self.tools = [task_tool]
                   ↓
2. wrap_model_call 往 system prompt 注入子 Agent 列表和使用说明
                   ↓
3. 模型调用 task() {"name":"task", "args":{"subagent_type":"probation-advisor", "description":"..."}}
                   ↓
4. ToolNode 执行   启动子 Agent graph → 子 Agent 独立运行(有自己的 middleware 栈) → 返回结果
```

#### SubAgent 触发机制详解

**触发条件：完全由 Lead Agent（LLM）自主决定。** 没有规则引擎或硬编码路由器，是 LLM 根据 system prompt 中的工具描述自行判断是否需要分派子 Agent。

**完整触发链路：**

```
┌─────────────────────────────────────────────────────────────────┐
│ 第 1 步: 初始化时注册 (SubAgentMiddleware.__init__)              │
│                                                                 │
│ _build_task_tool() 创建 task 工具，描述中嵌入所有 subagent 列表:   │
│   "Available agent types:                                       │
│    - math-expert: BASIS 数学学科专家...                           │
│    - science-expert: BASIS 科学学科专家...                        │
│    - probation-advisor: Academic Probation 保级专家...            │
│    - general-purpose: 通用 Agent..."                             │
└─────────────────────┬───────────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│ 第 2 步: 每次 LLM 调用前注入 prompt (wrap_model_call)            │
│                                                                 │
│ 往 system prompt 追加 task 工具的使用说明和示例                    │
│ LLM 看到完整上下文: 用户消息 + 工具列表(含 task) + 使用示例        │
└─────────────────────┬───────────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│ 第 3 步: LLM 自主决策                                            │
│                                                                 │
│ LLM 根据以下信息决定是否调用 task:                                │
│  · 用户问题的复杂度 (简单问题直接回答，不调 subagent)              │
│  · 工具描述中的 subagent 说明 (description 越精准，路由越准确)     │
│  · prompt 中的示例 ("complex, multi-step tasks" 才用 task)       │
└─────────────────────┬───────────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│ 第 4 步: 工具执行 (task 函数)                                     │
│                                                                 │
│ LLM 输出: tool_call {                                           │
│   name: "task",                                                 │
│   args: {                                                       │
│     subagent_type: "probation-advisor",                         │
│     description: "用户孩子 GPA 1.8，面临 Academic Probation..."  │
│   }                                                             │
│ }                                                               │
│          ↓                                                      │
│ ToolNode 执行 task() 函数:                                       │
│   1. 验证 subagent_type 是否存在                                 │
│   2. 创建独立 state: { messages: [HumanMessage(description)] }   │
│   3. subagent.ainvoke(state) — 启动子 Agent 独立运行             │
│   4. 子 Agent 完成后，提取最后一条消息作为 ToolMessage 返回        │
│          ↓                                                      │
│ Lead Agent 收到 ToolMessage，继续处理或返回最终回复                │
└─────────────────────────────────────────────────────────────────┘
```

**关键特性：**

| 特性 | 说明 |
|------|------|
| 无硬编码路由 | 纯靠 LLM 理解力，description 写得好不好直接决定路由准确性 |
| SubAgent 无状态 | 每次调用创建全新上下文，只有 description 作为输入 |
| 支持并行调用 | LLM 可以一次输出多个 task tool_call，同时启动多个 subagent |
| 单次调用 | 子 Agent 不能反问，返回最终结果后即销毁，无法与主 Agent 交互 |
| 结果为 ToolMessage | 子 Agent 的最终输出作为 ToolMessage 返回主 Agent 上下文 |

#### 典型协作模式

实际执行中，Skills 和 SubAgents 经常配合使用：

```
用户: "孩子 GPA 1.8 面临 Academic Probation，怎么办？"
  ↓
Lead Agent 第 1 步: read_file("/app/skills/probation-rescue/SKILL.md")  ← Skills
  → 获取危机评估模板、恢复计划框架等知识
  ↓
Lead Agent 第 2 步: task(subagent_type="probation-advisor", ...)         ← SubAgent
  → 分派给保级专家独立分析，生成完整方案
  ↓
Lead Agent 第 3 步: 汇总子 Agent 结果，结合 Skill 模板，返回最终回复
```

### Skills (11 个)

```
skills/
├── student-assessment/      学生水平评估
├── basis-knowledge/         BASIS 体系知识
├── ap-course-planning/      AP 选课规划
├── teaching-design/         教案生成
├── emi-teaching/            EMI 教学法
├── parent-communication/    家长沟通策略
├── math-tutoring/           数学辅导
├── science-tutoring/        科学辅导
├── humanities-tutoring/     人文辅导
├── exam-prep/               考试备考
└── probation-rescue/        保级恢复方案
```

## 数据库 Schema

### LangGraph 系统表 (自动建表)
- `checkpoints` — Agent 状态快照
- `checkpoint_blobs` — 序列化数据
- `checkpoint_writes` — 写入记录

### 业务表 (deploy/init.sql)

```sql
biz_users              -- 用户 (supabase_uid, wechat_openid, role, phone, ...)
student_profiles       -- 学生画像 (school, grade, GPA, AP courses, ...)
parent_student_links   -- 家长-学生绑定
subscriptions          -- 订阅 (free/basic/premium/vip)
usage_logs             -- 每日消息用量
purchases              -- 一次性购买
```

## 数据流

### 1. 登录流程
```
浏览器 → frontend(:8015) Server Action → Supabase Auth (SMS/微信)
  → 返回 Supabase JWT → 存储 session
```

### 2. 聊天流程
```
浏览器 JS → LangGraph SDK → agent(:5095) /threads/{id}/runs/stream
  → Lead Model (minimax-m2.5) → tool_calls
    → read_file (读取 Skill/Agent 定义)
    → task (分派 SubAgent，如 probation-advisor)
      → SubAgent 处理 → 返回结果
  → Lead Model 汇总 → SSE 流式返回浏览器
```

### 3. 配额检查 (规划中)
```
浏览器 → api(:5096) /api/quota/check → postgres → 返回额度
```

### 4. 记忆系统
```
agent → Mem0 Middleware → qdrant(:6333) 向量检索/存储
```

## 关键配置

| 配置项 | 当前值 | 来源 |
|--------|-------|------|
| Lead Model | `openai:minimax/minimax-m2.5` | `.env` → `BASIS_LEAD_MODEL` |
| SubAgent Model | `openai:minimax/minimax-m2.5` | `.env` → `BASIS_SUBAGENT_MODEL` |
| LLM Gateway | `http://150.109.16.195:8600/v1` | `.env` → `OPENAI_BASE_URL` |
| Graph Entry | `graph.py:agent` → `create_basis_expert_agent()` | `langgraph.json` |
| Frontend → Agent | `http://127.0.0.1:5095` (客户端直连) | `frontend/src/lib/config.ts` |
| API → Agent | `http://basis-agent:5095` (容器内网) | docker-compose → `LANGGRAPH_URL` |

### 重要注意事项

- **use_responses_api**: DeepAgents 对 `openai:` 前缀自动启用 OpenAI Responses API，但 LiteLLM 代理不支持。已在 `agent.py` 中通过 `_init_model()` 预初始化模型对象绕过（`use_responses_api=False`）。
- **分离式业务 API**: `server.py` 作为独立 FastAPI 服务运行，因为 LangGraph Server Docker 镜像不支持自定义中间件注入。
- **双 JWT 体系**: Supabase JWT (前端 Auth) + BASIS JWT (业务 API 认证)。

## 启动命令

### Docker 全栈 (推荐)
```bash
docker compose -f deploy/docker-compose.local.yml --env-file .env up -d --build
```

### 本地开发 (分别启动)
```bash
# Agent
langgraph dev --port 5095

# 业务 API
uvicorn src.basis_expert_council.server:app --host 0.0.0.0 --port 5096

# 前端
cd frontend && yarn dev --port 8015
```

## 文件结构

```
basis-expert-council/
├── graph.py                      # LangGraph Server 入口
├── langgraph.json                # LangGraph 服务器配置
├── AGENTS.md                     # 主 Agent 系统提示词
├── .env                          # 环境变量
├── agents/
│   ├── math-expert/AGENTS.md
│   ├── science-expert/AGENTS.md
│   ├── humanities-expert/AGENTS.md
│   ├── curriculum-advisor/AGENTS.md
│   ├── business-advisor/AGENTS.md
│   └── probation-advisor/AGENTS.md
├── skills/                       # 11 个 Skill 定义
├── src/basis_expert_council/
│   ├── agent.py                  # Agent 工厂 (create_basis_expert_agent)
│   ├── server.py                 # 业务 API (FastAPI, :5096)
│   ├── auth.py                   # 认证 (微信 OAuth + JWT)
│   └── db.py                     # 数据库 (业务表 CRUD)
├── deploy/
│   ├── docker-compose.local.yml  # 本地 Docker 全栈编排
│   ├── Dockerfile                # Agent 镜像
│   ├── Dockerfile.api            # 业务 API 镜像
│   ├── Dockerfile.frontend       # 前端镜像
│   └── init.sql                  # 业务表初始化 SQL
├── frontend/                     # Next.js 16 前端
│   ├── src/app/components/
│   │   ├── ChatInterface.tsx     # 聊天主界面
│   │   ├── WelcomeScreen.tsx     # 首屏 (角色分流 + 场景卡片)
│   │   ├── ChatMessage.tsx       # 消息渲染
│   │   └── ...
│   ├── src/lib/config.ts         # Agent 连接配置
│   └── src/app/login/page.tsx    # 登录页
└── docs/                         # 架构文档
```
