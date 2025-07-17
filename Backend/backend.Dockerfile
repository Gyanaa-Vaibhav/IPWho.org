FROM node:current-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5172

CMD ["npm", "run", "runDev"]