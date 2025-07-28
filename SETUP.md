# IPWho.org – Setup Guide

This guide walks you through setting up the IPWho.org API locally or in production using Docker Compose.

---

## Requirements

- Docker & Docker Compose (v2+)
- MaxMind GeoLite2 `.mmdb` and/or IP2Location `.bin` files (manually downloaded)
- `.env` files (samples provided)

---

## Environment Setup

### 1. Root `.env` (used by Docker Compose)

Create a `.env` file in the root directory based on `.env.sample`:

```env
BACKEND_PORT=3001
FRONTEND_PORT=3000
BACKEND_LOGS_LOCATION=./logs
BACKEND_FILE_LOCATION=./Backend/mainFiles
REDIS_PASSWORD=secret
REDIS_PORT=6379
```
These values are used to:
- Bind ports from containers
- Mount logs and DB files
- Connect services via Redis

---

2. Backend .env
   Inside Backend/:

```env
PORT=3001
```

---

3. Frontend .env

Inside Frontend/ (renamed from Frontend):
```env
PORT=3000
VITE_SERVER=http://localhost
```

---

## Local Development

Use the included docker-compose.yml for development. It mounts local code for hot reloading.

1. Setup .env files (as above)

2. Place Geo DB Files
    - Download MaxMind GeoLite2 .mmdb and/or IP2Location LITE .bin files
    - Place them anywhere and update BACKEND_FILE_LOCATION path in root .env
    - Example: ./Backend/mainFiles

3. Run Containers
  ```bash
  docker compose --env-file .env up --build
  ```
- This starts:
  - backend — IPWho API (with TypeScript + --watch)
  - frontend — React/Vite + Astro frontend
  - redis — caching layer

4. Hot Reload :
    - Frontend: Vite/React auto reload
    - Backend: Uses node --watch (nodemon not needed)

5. Logs: All logs go to the folder specified in BACKEND_LOGS_LOCATION.

---

## Production Deployment

Use docker-compose-prod.yml for a production-optimized build:
```bash
docker compose -f docker-compose-prod.yml --env-file .env up --build -d
```

Key differences :
- Frontend is prebuilt and served statically
- No volume mounts — containers are standalone
- Redis password + port configurable from .env

Optional: Add NGINX or HTTPS termination as needed (not included).

---

### Volumes & Data :
- Redis data is persisted to Docker volume: ipwho-Production-Redis
- Logs and DB paths are bind-mounted from host based on .env paths
- You can delete all containers & volumes via:

```bash
docker compose down -v
```

---

### Debugging Tips :
- Backend or frontend container fails? Check .env paths first
- Missing Geo DB? Backend will fail to start
- Redis connection errors? Check port/password match between .env and services
- Logs: Check inside your mounted BACKEND_LOGS_LOCATION folder

---

## Cleanup

Stop and remove containers + volumes
```bash
docker compose down -v
```

Remove dangling images
```bash
docker image prune -f
```