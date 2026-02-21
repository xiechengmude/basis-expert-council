#!/bin/bash
# ==============================================================================
# Dev 服务器部署脚本 (43.134.62.139)
# ==============================================================================
# 模式: langgraph up (官方镜像, uvicorn 生产模式)
# 端口: 5095 (Agent) + 8015 (Frontend)
# Compose: docker-compose.dev.yml
#
# 使用方法:
#   本地执行: ./deploy/scripts/deploy_dev.sh
#   或 SSH:   ssh root@43.134.62.139 '/home/basis-expert-council/deploy/scripts/deploy_dev.sh'
# ==============================================================================

set -e

# 配置
SERVER="43.134.62.139"
PROJECT_DIR="/home/basis-expert-council"
COMPOSE_FILE="deploy/docker-compose.dev.yml"
ENV_FILE=".env.dev"
GIT_BRANCH="main"

# 颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() { echo -e "${GREEN}[$(date '+%H:%M:%S')]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# 检测是否在远程服务器
if [ -d "$PROJECT_DIR" ]; then
    # 在服务器上
    cd "$PROJECT_DIR"
else
    # 在本地，SSH 到服务器执行
    log "Connecting to Dev server ($SERVER)..."
    ssh root@$SERVER "cd $PROJECT_DIR && ./deploy/scripts/deploy_dev.sh"
    exit $?
fi

log "=========================================="
log "Deploying BasisPilot to DEV"
log "=========================================="

# 1. 拉取代码
log "Step 1/4: Pulling latest code..."
git fetch origin $GIT_BRANCH
git reset --hard origin/$GIT_BRANCH
log "  Version: $(git log -1 --format='%h %s')"

# 2. 构建镜像
log "Step 2/4: Building Docker images..."
docker compose -f $COMPOSE_FILE --env-file $ENV_FILE build --no-cache basis-agent basis-api basis-frontend

# 3. 重启服务
log "Step 3/4: Restarting services..."
docker compose -f $COMPOSE_FILE --env-file $ENV_FILE down
docker compose -f $COMPOSE_FILE --env-file $ENV_FILE up -d

# 4. 健康检查
log "Step 4/4: Waiting for services..."
sleep 10
for i in {1..30}; do
    if curl -sf http://localhost:5095/ok > /dev/null; then
        log "Agent is healthy!"
        break
    fi
    if [ $i -eq 30 ]; then
        warn "Agent health check timed out"
    fi
    echo -n "."
    sleep 2
done

# 检查 Frontend
for i in {1..15}; do
    if curl -sf http://localhost:8015 > /dev/null; then
        log "Frontend is healthy!"
        break
    fi
    if [ $i -eq 15 ]; then
        warn "Frontend health check timed out"
    fi
    echo -n "."
    sleep 2
done

echo ""
log "=========================================="
log "DEV Deployment Complete!"
log "  Agent:    http://$SERVER:5095"
log "  Swagger:  http://$SERVER:5095/docs"
log "  Frontend: http://$SERVER:8015"
log "=========================================="
