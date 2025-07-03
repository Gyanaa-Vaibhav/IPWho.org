FROM node

ENV TZ=Asia/Kolkata

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 5172

CMD ["npm", "run", "runDev"]
