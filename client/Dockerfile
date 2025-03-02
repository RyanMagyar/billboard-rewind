FROM node:20-alpine

WORKDIR /client

COPY package*.json .

RUN npm i --force

COPY . .

CMD ["npm", "run", "dev"];