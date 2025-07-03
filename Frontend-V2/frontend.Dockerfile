FROM node

ENV TZ=Asia/Kolkata

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 5173

VOLUME [ "/app/node_modules" ]

CMD [ "npm", "run", "dev" ]