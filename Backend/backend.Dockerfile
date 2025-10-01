FROM node:current-alpine

RUN apk add --no-cache tzdata \
    && cp /usr/share/zoneinfo/Asia/Kolkata /etc/localtime \
    && echo "Asia/Kolkata" > /etc/timezone \
    && apk del tzdata

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 5172

CMD ["npm", "run", "runDev"]