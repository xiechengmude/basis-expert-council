# BASIS Expert Council — 部署文档

## 服务器信息

| 环境 | 服务器 | 端口 | 说明 |
|------|--------|------|------|
| Dev | 43.134.62.139 | 5095 / 8015 | Agent API + Frontend |
| Local | localhost | 5095 / 8015 | 本地开发 |

## 服务架构

```
┌─────────────────────────────────────────────────┐
│                  basis-network                   │
│                                                  │
│  ┌──────────────┐    ┌──────────────────────┐   │
│  │ basis-frontend│    │    basis-agent        │   │
│  │  (Next.js)   │───>│  (langgraph up)       │   │
│  │  :8015       │    │  :5095                │   │
│  └──────────────┘    └──────┬───────┬────────┘   │
│                             │       │            │
│                    ┌────────┘       └────────┐   │
│                    │                         │   │
│              ┌─────┴──────┐          ┌───────┴─┐ │
│              │basis-postgres│          │basis-redis│
│              │  (PG 16)    │          │ (Redis 7)│ │
│              │  :5436      │          │  :6395   │ │
│              └─────────────┘          └──────────┘ │
└─────────────────────────────────────────────────┘
```

## 日常代码更新 (最常用)

```bash
# 一键远程部署
./deploy/scripts/deploy_dev.sh

# 或手动 SSH 执行
ssh root@43.134.62.139
cd /home/basis-expert-council
git pull origin main
docker compose -f deploy/docker-compose.dev.yml --env-file .env.dev up -d --build
```

## 完整首次部署

### 1. 服务器准备

```bash
ssh root@43.134.62.139

# 克隆仓库
cd /home
git clone <repo-url> basis-expert-council
cd basis-expert-council

# 配置环境变量
cp .env.example .env.dev
# 编辑 .env.dev，填入 API Keys
```

### 2. 启动服务

```bash
docker compose -f deploy/docker-compose.dev.yml --env-file .env.dev up -d --build
```

### 3. 验证

```bash
# Agent 健康检查
curl http://localhost:5095/ok

# Swagger 文档
curl http://localhost:5095/docs

# Frontend
curl http://localhost:8015
```

## 本地开发

### 方式 A: 热重载模式 (推荐开发时使用)

```bash
# 启动 Docker 基础设施 (PG + Redis) + langgraph dev 热重载
./deploy/scripts/start_local.sh

# 指定端口
./deploy/scripts/start_local.sh --port 8000

# Debug 模式
./deploy/scripts/start_local.sh --debug

# 不启动 Docker (已有外部 PG/Redis)
./deploy/scripts/start_local.sh --no-docker

# 停止所有服务
./deploy/scripts/start_local.sh --stop
```

### 方式 B: Docker 全栈 (模拟生产环境)

```bash
# 启动全部 4 个容器
docker compose -f deploy/docker-compose.local.yml up -d --build

# 查看日志
docker compose -f deploy/docker-compose.local.yml logs -f basis-agent

# 停止
docker compose -f deploy/docker-compose.local.yml down
```

## 常用命令

### 日志查看

```bash
# Agent 日志
docker logs -f basis-agent --tail 100

# Frontend 日志
docker logs -f basis-frontend --tail 100

# PostgreSQL 日志
docker logs -f basis-postgres --tail 50

# 所有服务日志
docker compose -f deploy/docker-compose.dev.yml logs -f
```

### 服务管理

```bash
# 查看运行状态
docker compose -f deploy/docker-compose.dev.yml ps

# 仅重启 Agent
docker compose -f deploy/docker-compose.dev.yml --env-file .env.dev restart basis-agent

# 仅重建 Agent
docker compose -f deploy/docker-compose.dev.yml --env-file .env.dev up -d --build basis-agent

# 仅重建 Frontend
docker compose -f deploy/docker-compose.dev.yml --env-file .env.dev up -d --build basis-frontend

# 清理所有数据 (危险!)
docker compose -f deploy/docker-compose.dev.yml down -v
```

### 数据库操作

```bash
# 进入 PostgreSQL
docker exec -it basis-postgres psql -U postgres -d langgraph

# 查看 threads
docker exec basis-postgres psql -U postgres -d langgraph -c "SELECT COUNT(*) FROM checkpoints;"
```

## 环境变量说明

| 变量 | 说明 | 示例 |
|------|------|------|
| `OPENAI_API_KEY` | LLM API Key | `sk-xxx` |
| `OPENAI_BASE_URL` | LLM API Gateway | `http://150.109.16.195:8600/v1` |
| `BASIS_LEAD_MODEL` | 主智能体模型 | `openai:z-ai/glm-5` |
| `BASIS_SUBAGENT_MODEL` | 子智能体默认模型 | `openai:minimax/minimax-m2.5` |
| `LANGSMITH_API_KEY` | LangSmith API Key (必须) | `lsv2_pt_xxx` |
| `LANGCHAIN_TRACING_V2` | 启用追踪 | `true` |
| `LANGFUSE_SECRET_KEY` | Langfuse Secret | `sk-lf-xxx` |
| `LANGFUSE_PUBLIC_KEY` | Langfuse Public | `pk-lf-xxx` |
