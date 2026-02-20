#!/bin/bash
# ==============================================================================
# 本地开发启动脚本 — langgraph dev + Docker 持久化
# ==============================================================================
#
# Usage:
#   ./deploy/scripts/start_local.sh              # 默认启动 (端口 5095)
#   ./deploy/scripts/start_local.sh --port 8000  # 指定端口
#   ./deploy/scripts/start_local.sh --debug      # Debug 模式
#   ./deploy/scripts/start_local.sh --no-docker  # 不启动 Docker (仅 langgraph)
#   ./deploy/scripts/start_local.sh --stop       # 停止所有服务
#
# ==============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
PROJECT_ROOT="$(cd "$DEPLOY_DIR/.." && pwd)"

# 默认配置
PORT=5095
HOST="0.0.0.0"
DEBUG=false
WITH_DOCKER=true
STOP_ONLY=false

# 颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

log() { echo -e "${GREEN}[$(date '+%H:%M:%S')]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
info() { echo -e "${CYAN}[INFO]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# 解析参数
while [[ $# -gt 0 ]]; do
    case $1 in
        --port|-p)
            PORT="$2"
            shift 2
            ;;
        [0-9]*)
            PORT="$1"
            shift
            ;;
        --debug|-d)
            DEBUG=true
            shift
            ;;
        --no-docker)
            WITH_DOCKER=false
            shift
            ;;
        --stop)
            STOP_ONLY=true
            shift
            ;;
        --help|-h)
            echo "Usage: $0 [options]"
            echo ""
            echo "Options:"
            echo "  --port, -p PORT    指定端口 (默认: 5095)"
            echo "  --debug, -d        Debug 模式 (详细日志)"
            echo "  --no-docker        不启动 Docker 基础设施"
            echo "  --stop             停止所有服务"
            echo "  --help, -h         显示帮助"
            exit 0
            ;;
        *)
            warn "Unknown option: $1"
            shift
            ;;
    esac
done

# Banner
show_banner() {
    echo -e "${CYAN}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║       BasisPilot (贝领) — Local Development                  ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# 停止服务
stop_services() {
    log "Stopping services..."

    # 停止 langgraph dev
    OLD_PID=$(lsof -ti :$PORT 2>/dev/null || true)
    if [ -n "$OLD_PID" ]; then
        log "Killing langgraph process: $OLD_PID"
        kill -9 $OLD_PID 2>/dev/null || true
    fi

    # 停止 Docker
    cd "$DEPLOY_DIR"
    docker compose -f docker-compose.local.yml down 2>/dev/null || true

    log "All services stopped."
}

# 启动 Docker 基础设施 (仅 PostgreSQL + Redis)
start_docker() {
    log "Starting Docker infrastructure..."
    cd "$DEPLOY_DIR"

    # 仅启动 PostgreSQL + Redis (不启动 agent 和 frontend)
    docker compose -f docker-compose.local.yml up -d basis-postgres basis-redis

    # 等待 PostgreSQL 就绪
    log "Waiting for PostgreSQL..."
    for i in {1..30}; do
        if docker exec basis-postgres pg_isready -U postgres -d langgraph >/dev/null 2>&1; then
            log "PostgreSQL is ready!"
            break
        fi
        if [ $i -eq 30 ]; then
            error "PostgreSQL failed to start!"
        fi
        sleep 1
    done

    # 等待 Redis 就绪
    log "Waiting for Redis..."
    for i in {1..10}; do
        if docker exec basis-redis redis-cli -p 6395 ping >/dev/null 2>&1; then
            log "Redis is ready!"
            break
        fi
        sleep 1
    done
}

# 启动 langgraph dev (热重载模式)
start_langgraph() {
    cd "$PROJECT_ROOT"

    # 创建日志目录
    LOG_DIR="$PROJECT_ROOT/logs"
    mkdir -p "$LOG_DIR"
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    LOG_FILE="${LOG_DIR}/langgraph_${TIMESTAMP}.log"

    # 清理代理设置
    unset HTTP_PROXY HTTPS_PROXY http_proxy https_proxy

    # 设置环境变量
    if [[ "$WITH_DOCKER" == true ]]; then
        export POSTGRES_URI="postgresql://postgres:postgres@localhost:5436/langgraph?sslmode=disable"
        export REDIS_URI="redis://localhost:6395"
    fi

    # Debug 模式
    if [[ "$DEBUG" == true ]]; then
        export LOG_LEVEL="DEBUG"
        export LANGGRAPH_LOG_LEVEL="debug"
        export LANGCHAIN_TRACING_V2="true"
        log "DEBUG mode enabled"
    fi

    # 杀掉占用端口的进程和容器
    log "Checking port $PORT..."

    # 停止占用端口的 Docker 容器
    if docker ps --format '{{.Names}}' 2>/dev/null | grep -q "basis-agent"; then
        warn "Stopping Docker container: basis-agent"
        docker stop basis-agent 2>/dev/null || true
        sleep 2
    fi

    # 杀掉占用端口的本地进程
    OLD_PID=$(lsof -ti :$PORT 2>/dev/null || true)
    if [ -n "$OLD_PID" ]; then
        warn "Killing process on port $PORT: $OLD_PID"
        kill -9 $OLD_PID 2>/dev/null || true
        sleep 2
    fi

    echo ""
    info "=============================================="
    info "  LangGraph Dev Server (Hot-Reload)"
    info "=============================================="
    info "  URL:        http://localhost:$PORT"
    info "  Swagger:    http://localhost:$PORT/docs"
    if [[ "$WITH_DOCKER" == true ]]; then
        info "  PostgreSQL: localhost:5436"
        info "  Redis:      localhost:6395"
    fi
    info "  Log:        $LOG_FILE"
    info "=============================================="
    echo ""

    log "Starting langgraph dev..."
    log "Press Ctrl+C to stop"
    echo ""

    # 启动 langgraph dev (热重载模式)
    # --allow-blocking: 允许同步阻塞调用 (文件读取等)
    uv run langgraph dev --host "$HOST" --port "$PORT" --allow-blocking 2>&1 | tee "$LOG_FILE"
}

# 主流程
main() {
    show_banner

    if [[ "$STOP_ONLY" == true ]]; then
        stop_services
        exit 0
    fi

    # 检查依赖
    if [[ "$WITH_DOCKER" == true ]]; then
        if ! command -v docker &> /dev/null; then
            error "Docker is not installed!"
        fi
    fi

    if ! command -v uv &> /dev/null; then
        error "uv is not installed! Run: curl -LsSf https://astral.sh/uv/install.sh | sh"
    fi

    # 启动服务
    if [[ "$WITH_DOCKER" == true ]]; then
        start_docker
    fi

    start_langgraph
}

# 捕获 Ctrl+C
cleanup() {
    echo ""
    log "Shutting down..."
    if [[ "$WITH_DOCKER" == true ]]; then
        read -p "Stop Docker services too? [y/N] " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            stop_services
        fi
    fi
    exit 0
}

trap cleanup INT TERM

main
