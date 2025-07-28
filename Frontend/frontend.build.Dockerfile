## === STAGE 1: Build ===
FROM node:current-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

## === STAGE 2: Production Files ===
FROM alpine:latest AS runner

WORKDIR /app

COPY --from=builder /app/build ./build

CMD ["sh", "-c", "exit 0"]