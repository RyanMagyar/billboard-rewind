FROM node:20-alpine

WORKDIR /server

COPY package*.json ./

RUN npm ci

COPY . .

CMD ["npm", "run", "start"]
