FROM node:current-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 5172

CMD ["npm", "run", "runDev"]