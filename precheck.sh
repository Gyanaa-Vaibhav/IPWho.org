#!/usr/bin/env bash
set -euo pipefail

# ---------------------------
# Local CI Pre-check Script
# ---------------------------
# Runs the same steps as your GitHub Actions pipeline:
#  1. Build Docker image
#  2. Run linter
#  3. Run tests
#  4. Clean up containers
# ---------------------------

DOCKER_COMPOSE_FILE="docker-compose-test.yml"
ENV_FILE="/env/ipWho/.env"
SERVICE_NAME="ipWho_backend_testing"

echo "[1/4] Building Docker images..."
docker compose -f "$DOCKER_COMPOSE_FILE" --env-file "$ENV_FILE" build

echo "[2/4] Starting containers..."
docker compose -f "$DOCKER_COMPOSE_FILE" --env-file "$ENV_FILE" up -d

# ensure cleanup on exit no matter what
cleanup() {
  echo "[4/4] Cleaning up containers..."
  docker compose -f "$DOCKER_COMPOSE_FILE" --env-file "$ENV_FILE" down
}
trap cleanup EXIT

echo "[3/4] Running linter inside container..."
docker exec -i "$SERVICE_NAME" sh -c "npm run lint"

echo "[3/4] Running tests inside container..."
docker exec -i "$SERVICE_NAME" sh -c "npm run test"

echo "Pre-check passed! Safe to push"