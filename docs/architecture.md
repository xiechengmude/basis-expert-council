# BasisPilot 贝领 - 系统架构文档

## 概述

BasisPilot（贝领）是基于 DeepAgents / LangGraph 架构的多智能体 AI 教育领航平台，为贝赛思 (BASIS) 教育体系提供课程同步辅导和咨询服务。

## 技术栈

| 层 | 技术 | 说明 |
|---|------|------|
| 前端 | Next.js 16 (Turbopack) | deep-agents-ui，端口 8015 |
| 后端 API | LangGraph Server | langgraph dev (in-memory)，端口 5095 |
| Agent 框架 | DeepAgents + LangGraph | 多智能体编排 |
| LLM 网关 | LiteLLM Proxy | `http://150.109.16.195:8600/v1` |
| 主模型 | z-ai/glm-5 | 主 Agent 使用 |
| 子模型 | minimax/minimax-m2.5 | 4 个子 Agent 使用 |
| 追踪 | LangSmith | 项目: basis-expert-council |

## 系统架构

```
Browser (localhost:8015)
    │
    │  HTTP/SSE
    ▼
┌─────────────────────────┐
│  deep-agents-ui         │  Next.js 16 前端
│  (frontend/)            │
└─────────┬───────────────┘
          │  LangGraph SDK
          │  POST /runs/stream
          ▼
┌─────────────────────────┐
│  LangGraph Server       │  langgraph dev :5095
│  (graph.py → agent)     │
│                         │
│  ┌───────────────────┐  │
│  │  Main Agent       │  │  openai:z-ai/glm-5
│  │  (AGENTS.md)      │  │
│  │                   │  │
│  │  ┌─────────────┐  │  │
│  │  │ Supervisor  │──┼──┼──► 路由到子 Agent
│  │  └─────────────┘  │  │
│  └───────────────────┘  │
│                         │
│  ┌─── Subagents ─────┐  │  openai:minimax/minimax-m2.5
│  │ math-expert       │  │  数学学科专家
│  │ science-expert    │  │  科学学科专家
│  │ humanities-expert │  │  人文学科专家
│  │ curriculum-advisor│  │  课程规划顾问
│  └───────────────────┘  │
└─────────┬───────────────┘
          │  OpenAI-compatible API
          ▼
┌─────────────────────────┐
│  LiteLLM Proxy          │  http://150.109.16.195:8600/v1
│  (统一 LLM 网关)         │
└─────────┬───────────────┘
          │
          ▼
┌─────────────────────────┐
│  LLM Providers          │
│  - GLM-5 (z-ai)        │
│  - MiniMax M2.5         │
└─────────────────────────┘
```

## 文件结构

```
basis-expert-council/
├── graph.py                  # LangGraph Server 入口
├── langgraph.json            # LangGraph 服务器配置
├── .env                      # 环境变量 (LiteLLM + LangSmith)
├── pyproject.toml            # Python 项目配置
├── AGENTS.md                 # 主 Agent 系统提示词
├── agents/
│   ├── math-expert/AGENTS.md
│   ├── science-expert/AGENTS.md
│   ├── humanities-expert/AGENTS.md
│   └── curriculum-advisor/AGENTS.md
├── skills/                   # Agent 技能定义
├── src/basis_expert_council/
│   └── agent.py              # Agent 工厂 (create_basis_expert_agent)
├── frontend/                 # deep-agents-ui (Next.js)
└── docs/                     # 架构文档
```

## 数据流

1. 用户在浏览器 (`localhost:8015`) 输入问题
2. 前端通过 LangGraph SDK 向后端 (`127.0.0.1:5095`) 发送请求
3. 主 Agent (GLM-5) 分析问题，决定路由到哪个子 Agent
4. 子 Agent (MiniMax M2.5) 处理专业领域问题
5. 响应通过 SSE 流式返回前端

## 启动命令

```bash
# 后端
cd /Users/gumpm5/Documents/Code/basis-expert-council
.venv/bin/langgraph dev --port 5095

# 前端
cd frontend
yarn dev --port 8015
```

## 浏览器配置

- URL: `http://localhost:8015`
- Deployment URL: `http://127.0.0.1:5095`
- Assistant ID: `basis-expert`
