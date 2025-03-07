FROM node:20-alpine

WORKDIR /server

COPY package*.json ./

RUN npm i

COPY . .

CMD ["npm", "run", "dev"];