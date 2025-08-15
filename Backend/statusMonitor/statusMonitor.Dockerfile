FROM node:current-alpine

WORKDIR /app

COPY package-lock.json .
COPY package.json .

RUN npm ci

COPY . .

CMD ["sh", "./entrypoint.sh"]