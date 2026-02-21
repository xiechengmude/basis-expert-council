---
title: BasisPilot 本地开发联调 & 调试技能
description: 面向全栈工程师的本地开发、联调、调试、测试方法论
author: Claude Opus 4.6
version: 1.0.0
created: 2026-02-21T03:30:00+08:00
updated: 2026-02-21T03:30:00+08:00
git_commit: b04d5bb
git_hash: b04d5bb14278731d90d6d3d22d32be468bb74232
git_branch: main
tags: [debugging, testing, devops, local-dev, fullstack]
project: basis-expert-council
stack: LangGraph + FastAPI + Next.js + PostgreSQL + Redis + Qdrant
---

# BasisPilot 本地开发联调 & 调试技能

> 面向全栈工程师的本地开发、联调、调试、测试方法论
> 适用于：LangGraph Agent + FastAPI + Next.js + PostgreSQL + Redis + Qdrant 六容器架构

---

## 一、架构全貌 — 理解联调对象

```
┌─────────────────────────────────────────────────────────┐
│                    用户浏览器                              │
│              http://localhost:8015                        │
└──────────────┬──────────────────┬────────────────────────┘
               │ Supabase Auth    │ LangGraph Stream
               │ + BASIS JWT      │ SSE /runs/stream
               ▼                  ▼
┌──────────────────┐   ┌──────────────────────┐
│  Business API    │   │   LangGraph Agent    │
│  FastAPI :5096   │   │   DeepAgents :5095   │
│                  │   │                      │
│  • Auth/JWT      │   │  • 6 Subagents       │
│  • Quota         │   │  • 11 Skills         │
│  • User CRUD     │   │  • 4 Memory Tools    │
│  • Student       │   │  • A2UI Interrupt     │
└───────┬──────────┘   └──────┬──────┬────────┘
        │                     │      │
        ▼                     ▼      ▼
┌──────────────┐  ┌────────┐  ┌──────────┐
│ PostgreSQL   │  │ Redis  │  │  Qdrant  │
│ :5436→5432   │  │ :6395  │  │  :6333   │
│ checkpoints  │  │ pubsub │  │  vectors │
│ + biz tables │  │        │  │  (Mem0)  │
└──────────────┘  └────────┘  └──────────┘
```

### 关键端口速查

| 服务 | 容器端口 | 本机映射 | 健康检查 |
|------|---------|---------|---------|
| Frontend | 8015 | 8015 | `wget http://localhost:8015` |
| Agent | 5095 | 5095 | `curl http://localhost:5095/ok` |
| Business API | 5096 | 5096 | `curl http://localhost:5096/ok` |
| PostgreSQL | 5432 | 5436 | `pg_isready -U postgres -p 5436` |
| Redis | 6395 | 6395 | `redis-cli -p 6395 ping` |
| Qdrant | 6333 | 6333 | `curl http://localhost:6333/collections` |

---

## 二、启动方式 — 三种开发模式

### 模式 A：全 Docker（推荐初次验证）

```bash
# 完整构建+启动
docker compose -f deploy/docker-compose.local.yml --env-file .env up -d --build

# 仅重建某个服务
docker compose -f deploy/docker-compose.local.yml --env-file .env up -d --build basis-frontend

# 查看状态
docker compose -f deploy/docker-compose.local.yml ps

# 查看日志
docker logs -f basisPilot-agent    # Agent 日志
docker logs -f basisPilot-api      # Business API 日志
docker logs -f basisPilot-frontend # Frontend 日志
```

**优点**：最接近生产环境，一键启动
**缺点**：每次改代码需 rebuild，前端 build 需 1-2 分钟

### 模式 B：基础设施 Docker + Agent 热重载（日常开发推荐）

```bash
# 1. 启动基础设施（Postgres + Redis + Qdrant）
docker compose -f deploy/docker-compose.local.yml --env-file .env up -d basis-postgres basis-redis basis-qdrant

# 2. 热重载启动 Agent
langgraph dev --config langgraph.json

# 3. 热重载启动 Business API
uvicorn src.basis_expert_council.server:app --host 0.0.0.0 --port 5096 --reload

# 4. 热重载启动 Frontend
cd frontend && npm run dev
```

**优点**：代码改动实时生效，调试体验最佳
**缺点**：需手动启动多个进程

### 模式 C：脚本一键启动

```bash
./deploy/scripts/start_local.sh            # 默认启动
./deploy/scripts/start_local.sh --debug    # 带调试日志
./deploy/scripts/start_local.sh --stop     # 停止所有
```

---

## 三、联调分层调试法

### 原则：从下往上，逐层确认

```
Layer 4: Frontend (UI 展示 + 用户交互)
Layer 3: Agent   (LLM 调度 + Tool 执行)
Layer 2: API     (业务逻辑 + Auth)
Layer 1: Infra   (DB + Redis + Qdrant)
```

**遇到问题时，永远从 Layer 1 开始确认**。

---

### Layer 1: 基础设施健康检查

```bash
# 一键检查所有基础服务
echo "=== PostgreSQL ===" && pg_isready -h localhost -p 5436 -U postgres
echo "=== Redis ===" && redis-cli -p 6395 ping
echo "=== Qdrant ===" && curl -s http://localhost:6333/collections | python3 -m json.tool
echo "=== Agent ===" && curl -s http://localhost:5095/ok
echo "=== API ===" && curl -s http://localhost:5096/ok
```

#### 常见问题

| 症状 | 原因 | 解决 |
|------|------|------|
| PostgreSQL 连不上 | 端口占用或容器未启动 | `lsof -ti:5436` 查看占用 |
| Redis 连不上 | 注意端口是 6395 不是 6379 | 检查 docker-compose 端口映射 |
| Qdrant 无 collection | Mem0 首次初始化未执行 | 发一条触发 memory 的消息即可 |
| Agent `/ok` 503 | LANGSMITH_API_KEY 无效 | 检查 `.env` 中的 License Key |

#### PostgreSQL 直连调试

```bash
# 连接数据库
psql "postgresql://postgres:postgres@localhost:5436/langgraph"

# 查看业务表
\dt biz_*
SELECT * FROM biz_users LIMIT 5;
SELECT * FROM subscriptions WHERE status = 'active';
SELECT * FROM usage_logs WHERE log_date = CURRENT_DATE;

# 查看 LangGraph checkpoints（调试消息丢失）
SELECT thread_id, checkpoint_ns, created_at
FROM checkpoints ORDER BY created_at DESC LIMIT 10;
```

#### Qdrant 向量库调试

```bash
# 查看所有 collections
curl http://localhost:6333/collections | python3 -m json.tool

# 查看记忆数量
curl http://localhost:6333/collections/basispilot_memories | python3 -m json.tool

# 搜索特定用户的记忆
curl -X POST http://localhost:6333/collections/basispilot_memories/points/scroll \
  -H 'Content-Type: application/json' \
  -d '{"filter":{"must":[{"key":"user_id","match":{"value":"basis_user_xxx"}}]},"limit":10}'
```

---

### Layer 2: Business API 调试

#### 快速验证端点

```bash
# 健康检查
curl http://localhost:5096/ok

# 查看定价（无需 auth）
curl http://localhost:5096/api/pricing | python3 -m json.tool

# 手动发送验证码（测试 SMS）
curl -X POST http://localhost:5096/api/auth/send-code \
  -H 'Content-Type: application/json' \
  -d '{"phone": "13800138000"}'

# 带 JWT 查用户信息
curl -H "Authorization: Bearer <your-basis-jwt>" \
  http://localhost:5096/api/user/me | python3 -m json.tool

# 检查配额
curl -X POST http://localhost:5096/api/quota/check \
  -H "Authorization: Bearer <your-basis-jwt>" \
  -H 'Content-Type: application/json' \
  -d '{"user_id": "xxx"}'
```

#### Auth 流程调试

```
1. SMS 登录流程:
   send-code → phone-login → sync → 获得 BASIS JWT

2. 常见卡点:
   - send-code 返回 500: 检查 ALIYUN_ACCESS_KEY_ID 等环境变量
   - phone-login 返回 400: 验证码过期（5分钟）或已使用
   - sync 返回 500: biz_users 表不存在 → 检查 init.sql 或 server 启动日志
```

#### JWT 手动解码

```bash
# 解码 BASIS JWT（查看 payload）
echo "<your-jwt>" | cut -d. -f2 | base64 -d 2>/dev/null | python3 -m json.tool
```

---

### Layer 3: Agent 调试

#### 直接调用 Agent API

```bash
# 创建 thread
curl -X POST http://localhost:5095/threads \
  -H 'Content-Type: application/json' \
  -d '{"metadata": {}}' | python3 -m json.tool

# 发送消息（同步）
curl -X POST http://localhost:5095/runs \
  -H 'Content-Type: application/json' \
  -d '{
    "assistant_id": "basis-expert",
    "thread_id": "<thread-id>",
    "input": {
      "messages": [{"role": "user", "content": "你好，帮我分析一下数学成绩"}]
    },
    "config": {
      "configurable": {"user_id": "test-user-123"}
    }
  }'

# 发送消息（流式）
curl -X POST http://localhost:5095/runs/stream \
  -H 'Content-Type: application/json' \
  -d '{
    "assistant_id": "basis-expert",
    "thread_id": "<thread-id>",
    "input": {
      "messages": [{"role": "user", "content": "AP Calculus 怎么备考"}]
    },
    "config": {
      "configurable": {"user_id": "test-user-123"}
    },
    "stream_mode": ["events"]
  }'
```

#### LangSmith 追踪（推荐）

```bash
# .env 中启用
LANGCHAIN_TRACING_V2=true
LANGCHAIN_PROJECT=basis-expert-local

# 然后去 https://smith.langchain.com 查看调用链：
# - 每次 tool call 的输入/输出
# - subagent 调度决策
# - memory 检索结果
# - token 消耗
```

#### Agent 常见问题排查

| 症状 | 排查路径 |
|------|---------|
| Agent 返回空响应 | 1. 检查 LLM API Key 2. 查看 docker logs 3. 开启 LangSmith |
| Subagent 未被调度 | 查 AGENTS.md 中的 dispatch 规则，确认问题匹配 |
| Memory 工具报错 | 检查 Qdrant 连接 + MEM0_LLM_MODEL 是否可用 |
| A2UI 中断无响应 | 前端需正确处理 interrupt 事件并调用 resume |
| 递归超限 | `AGENT_RECURSION_LIMIT` 默认 200，复杂多轮可能不够 |
| Monkey patch 报错 | deepagents/langchain 版本更新导致 patch 失效 |

#### Agent Python 调试（交互式）

```python
# 本地直接测试 agent（无需 LangGraph Server）
import asyncio
from src.basis_expert_council.agent import create_basis_expert_agent

async def test():
    agent = create_basis_expert_agent()
    config = {"configurable": {"thread_id": "test-1", "user_id": "debug-user"}}
    result = await agent.ainvoke(
        {"messages": [{"role": "user", "content": "你好"}]},
        config=config,
    )
    print(result["messages"][-1].content)

asyncio.run(test())
```

---

### Layer 4: Frontend 调试

#### 开发服务器

```bash
cd frontend
npm run dev          # 默认 http://localhost:3000（需改端口）
# 或
PORT=8015 npm run dev  # 匹配 Docker 端口
```

#### 关键调试点

**1. LangGraph 连接配置**
- 文件: `frontend/src/lib/config.ts`
- 默认: `http://127.0.0.1:5095`
- 用户可在 UI 设置弹窗修改（localStorage 持久化）

**2. Streaming 状态调试**
```typescript
// 在 useChat.ts 中加 console.log 追踪事件流
// 关键事件：
// - "on_chat_model_stream"  → LLM 输出 token
// - "on_tool_start"         → 工具开始执行
// - "on_tool_end"           → 工具返回结果
// - interrupt               → A2UI 中断等待用户
```

**3. Tool Call 展示调试**
```
开发模式: .env.local 设置 NEXT_PUBLIC_DEV_TOOLS=true
→ 所有工具调用恢复原始展示（tool name + args + result）

生产模式: 默认或 NEXT_PUBLIC_DEV_TOOLS=false
→ hidden 工具聚合为思考指示器，friendly 工具中文友好名
```

**4. Auth 流程调试**
```
浏览器 DevTools → Application → Cookies:
- sb-*-auth-token   → Supabase session
- basis-token       → Business API JWT（如果有）

Network 面板过滤:
- `/api/auth/`      → 看登录流程
- `/api/quota/`     → 看配额检查
- `/runs/stream`    → 看 Agent 流式响应
```

**5. A2UI 调试**
```
1. 访问 /a2ui-demo 页面查看所有 A2UI 组件
2. Agent 端 a2ui_render() 的 JSONL 格式可在 LangSmith 中查看
3. 前端 A2UISurface 组件负责解析 JSONL → React 组件
4. 用户交互后调用 resumeInterrupt(action) 恢复 Agent
```

---

## 四、端到端联调场景

### 场景 1: 新用户首次登录 + 对话

```
验证步骤:
1. 打开 http://localhost:8015 → 应重定向到 /login
2. 输入手机号 → 点发送验证码
   → 检查: API logs 有 send-code 请求
   → 检查: 手机收到短信（或查 API logs 中打印的验证码）
3. 输入验证码 → 登录
   → 检查: biz_users 表新增一行
   → 检查: subscriptions 表有 free plan
4. 进入 onboarding → 填写学生信息
   → 检查: student_profiles 表
5. 发送第一条消息
   → 检查: usage_logs 表 used_today +1
   → 检查: Agent 流式返回内容
```

### 场景 2: Memory 记忆系统

```
验证步骤:
1. 对话: "我是 G10 的学生，数学比较薄弱"
   → Agent 应自动调用 remember_fact
   → 检查 Qdrant: basispilot_memories collection 新增记录
2. 新会话: "帮我制定学习计划"
   → Agent 应调用 recall_memories
   → 回复应包含"G10"、"数学薄弱"等个性化信息
3. 对话: "请忘掉我的数学信息"
   → Agent 应调用 forget_memory
   → Qdrant 对应记录被删除
```

### 场景 3: Subagent 调度

```
验证步骤:
1. 问数学题: "解方程 2x + 3 = 7"
   → Agent 应调度 math-expert
   → 前端显示"数学专家"子代理指示器
2. 问科学题: "光合作用的原理是什么"
   → Agent 应调度 science-expert
3. 问升学: "AP 选课怎么规划"
   → Agent 应调度 curriculum-advisor
```

### 场景 4: 配额限制

```
验证步骤:
1. 确认用户是 free plan (5 msgs/day)
2. 发送 5 条消息 → 应正常
3. 发送第 6 条 → 前端应显示配额用尽提示
   → 检查: /api/quota/check 返回 {allowed: false}
```

---

## 五、调试工具箱

### Docker 常用命令

```bash
# 查看所有容器状态
docker compose -f deploy/docker-compose.local.yml ps

# 进入容器 shell
docker exec -it basisPilot-agent bash
docker exec -it basisPilot-postgres psql -U postgres -d langgraph

# 实时日志（可组合多个）
docker logs -f basisPilot-agent --tail 100
docker logs -f basisPilot-api --tail 100

# 重启单个服务（不重建）
docker compose -f deploy/docker-compose.local.yml restart basis-agent

# 清理重建
docker compose -f deploy/docker-compose.local.yml down
docker compose -f deploy/docker-compose.local.yml up -d --build

# 清理 volumes（⚠️ 会丢失数据）
docker compose -f deploy/docker-compose.local.yml down -v
```

### 环境变量检查清单

```bash
# 必须设置的变量（缺一不可）
grep -E "^(OPENAI_API_KEY|LANGSMITH_API_KEY|BASIS_JWT_SECRET)" .env

# 可选但推荐
grep -E "^(LANGCHAIN_TRACING|NEXT_PUBLIC_SUPABASE)" .env

# 检查 Docker 是否正确注入
docker exec basisPilot-agent env | grep OPENAI
docker exec basisPilot-api env | grep BASIS_JWT
```

### 网络调试

```bash
# 容器间连通性测试
docker exec basisPilot-frontend wget -qO- http://basis-agent:5095/ok
docker exec basisPilot-api curl -s http://basis-postgres:5432 || echo "TCP ok"

# 端口占用排查
lsof -i:8015  # Frontend
lsof -i:5095  # Agent
lsof -i:5096  # API
```

### Python 依赖调试

```bash
# 进入 Agent 容器检查包版本
docker exec basisPilot-agent pip list | grep -E "deepagents|langchain|langgraph|mem0"

# 本地环境
pip list | grep -E "deepagents|langchain|langgraph|mem0"

# 常见冲突: protobuf 版本
# mem0ai 拉入 protobuf 5.x，langgraph-api 需要 6.x
# 解决: pip install "protobuf>=6.31.1" (Dockerfile 最后一步已处理)
```

---

## 六、测试方法论

### 测试金字塔

```
         ╱╲
        ╱  ╲       E2E Tests (最少，最慢)
       ╱────╲      场景: 完整用户旅程
      ╱      ╲
     ╱────────╲    Integration Tests (适量)
    ╱          ╲   场景: API→DB, Agent→Memory, Auth 流程
   ╱────────────╲
  ╱              ╲  Unit Tests (最多，最快)
 ╱────────────────╲ 场景: 工具函数, DB 操作, 配置解析
```

### 运行测试

```bash
# 全部测试
pytest tests/ -v

# 单个测试文件
pytest tests/test_sms_routes.py -v

# 带覆盖率
pytest tests/ --cov=src/basis_expert_council --cov-report=html

# A2UI 端到端（需要 Agent 运行）
pytest tests/test_a2ui_e2e.py -v --timeout=60
```

### 手动测试检查清单

```
□ 基础设施
  □ PostgreSQL 可连接, biz_* 表存在
  □ Redis PING 正常
  □ Qdrant /collections 可访问

□ Business API
  □ /ok 返回 200
  □ /api/pricing 返回计划列表
  □ SMS 发送 + 验证流程
  □ JWT 签发 + 验证

□ Agent
  □ /ok 返回 200
  □ 简单对话有响应
  □ Subagent 正确调度
  □ Memory 工具读写
  □ A2UI 中断+恢复

□ Frontend
  □ 登录页正常渲染
  □ 对话界面流式输出
  □ Tool call 友好化显示
  □ 子代理中文名显示
  □ 配额检查生效
```

---

## 七、已知坑 & 解决方案

### 1. Agent 启动失败: LANGSMITH_API_KEY

```
症状: Agent 容器 unhealthy, logs 显示 license 验证失败
原因: LangGraph Server 需要有效的 LangSmith API Key
解决: 在 .env 中设置正确的 LANGSMITH_API_KEY
```

### 2. Frontend Build 失败: Google Fonts

```
症状: Turbopack build 报 "Failed to fetch Inter from Google Fonts"
原因: 网络问题（墙）
解决: 使用 --webpack flag 构建，或在 Dockerfile 中已配置 (npx next build --webpack)
```

### 3. Frontend Build 失败: Supabase URL

```
症状: "Your project's URL and API key are required to create a Supabase client"
原因: docker-compose 未传 NEXT_PUBLIC_* build args
解决: docker-compose.local.yml 的 basis-frontend.build.args 已修复
```

### 4. 端口占用

```
症状: "address already in use" 8015/5095/5096
解决:
  kill $(lsof -ti:8015)  # 杀掉占用进程
  # 或 docker compose down 后重新 up
```

### 5. Monkey Patch 失效

```
症状: agent.py 中 deepagents/langchain 的 monkey patch 报 AttributeError
原因: 框架版本更新导致被 patch 的方法签名变化
解决:
  1. 查看 agent.py 中 patch 注释的版本说明
  2. 更新 patch 逻辑匹配新版本
  3. 长期: 等上游修复后移除 patch
```

### 6. Mem0 首次初始化慢

```
症状: 第一次涉及记忆的对话响应很慢（10-30秒）
原因: Mem0 SDK lazy init，首次需连接 Qdrant + 创建 collection
解决: 已知问题，后续可预热 (server startup 时 init)
```

### 7. SMS 验证码在重启后丢失

```
症状: 发了验证码但验证时说无效
原因: sms.py 用内存 dict 存储，容器重启后丢失
解决: 短期可接受，长期应迁移到 Redis
```

---

## 八、开发者 Workflow 最佳实践

### 日常开发循环

```
1. 拉取最新代码
   git pull origin main

2. 启动基础设施
   docker compose -f deploy/docker-compose.local.yml --env-file .env \
     up -d basis-postgres basis-redis basis-qdrant

3. 根据改动范围选择启动方式:
   - 改 Agent Python:  langgraph dev (热重载)
   - 改 Business API:  uvicorn ... --reload
   - 改 Frontend:      cd frontend && npm run dev
   - 全栈:             全 Docker

4. 开发 + 测试

5. 提交前检查:
   - TypeScript: cd frontend && npx tsc --noEmit
   - Python: 无 lint 配置，建议手动检查
   - 测试: pytest tests/ -v

6. 提交 + 推送
```

### 部署到开发服务器

```bash
# 本地测试通过后
git push origin main

# SSH 到开发机
ssh root@43.134.62.139
cd /home/basis-expert-council
git pull origin main
docker compose -f deploy/docker-compose.dev.yml --env-file .env.dev up -d --build

# 验证
docker compose -f deploy/docker-compose.dev.yml ps
curl http://localhost:5095/ok
curl http://localhost:5096/ok
```

### Debug 日志级别

```bash
# Agent 详细日志
BASIS_LOG_LEVEL=DEBUG langgraph dev

# FastAPI 详细日志
uvicorn src.basis_expert_council.server:app --reload --log-level debug

# Next.js 详细日志
DEBUG=* npm run dev
```

---

## 九、文件快速索引

### 改什么 → 看什么

| 要改的功能 | 关键文件 |
|-----------|---------|
| Agent 调度逻辑 | `AGENTS.md`, `src/.../agent.py` |
| Subagent 系统提示 | `agents/{name}/AGENTS.md` |
| Memory 工具 | `src/.../memory_tools.py`, `src/.../memory.py` |
| A2UI 交互 | `src/.../a2ui_tool.py`, `frontend/src/app/a2ui/` |
| Auth 登录 | `src/.../auth.py`, `src/.../sms.py`, `frontend/src/app/login/` |
| 配额/计费 | `src/.../db.py` (PLAN_LIMITS), `src/.../server.py` (/quota) |
| 前端聊天 UI | `frontend/src/app/components/Chat*.tsx` |
| Tool call 展示 | `frontend/src/app/config/toolDisplayConfig.ts` |
| Docker 部署 | `deploy/docker-compose.*.yml`, `deploy/Dockerfile*` |
| 环境变量 | `.env.example`, `deploy/docker-compose.*.yml` |

---

## 十、Checklist：上线前全链路验证

```
□ 环境变量完整 (.env / .env.dev)
□ 6 个容器全部 healthy
□ PostgreSQL 业务表已创建
□ Qdrant collection 可访问
□ SMS 发送正常（测试号码）
□ 登录→注册→对话 完整流程
□ Free plan 配额限制生效
□ Memory 记忆存储和召回
□ A2UI 中断和恢复
□ Subagent 调度覆盖所有学科
□ 前端 tool call 友好化展示
□ favicon + manifest 正常
□ HTTPS / 域名 / CORS 配置
```
