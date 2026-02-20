# ==============================================================================
# BasisPilot (贝领) — LangGraph Official Image + Custom Dependencies
# ==============================================================================
# 基于官方 langgraph-api 镜像，预装业务依赖
# 使用 langgraph up 模式 (uvicorn 生产服务)
# ==============================================================================

FROM langchain/langgraph-api:0.5.42-py3.12

WORKDIR /app

# Install curl for health checks + uv for dependency management
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/* \
    && pip install --no-cache-dir uv

# Copy dependency files
COPY pyproject.toml README.md ./

# Install dependencies into system Python
# IMPORTANT: After install, restore base image editable packages (/api, /storage)
# because uv may upgrade langgraph-api from the editable /api to a PyPI version
# which breaks langgraph-storage-postgres's imports.
RUN uv pip install --system -e . \
    && uv pip install --system --no-deps -e /api -e /storage

# Copy langgraph.json config
COPY langgraph.json ./

# Copy application code
COPY graph.py ./
COPY src/ ./src/
COPY agents/ ./agents/
COPY skills/ ./skills/
COPY knowledge/ ./knowledge/
COPY AGENTS.md ./

# Environment
# /api: base image's langgraph_api (must precede site-packages)
ENV PYTHONPATH="/api:$PYTHONPATH"
ENV PYTHONUNBUFFERED=1
