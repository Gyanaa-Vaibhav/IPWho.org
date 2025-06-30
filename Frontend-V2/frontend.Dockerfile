FROM node

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 5173

VOLUME [ "/app/node_modules" ]

CMD [ "npm", "run", "dev" ]