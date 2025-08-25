FROM node:20-alpine

WORKDIR /tickets_backend

COPY package*.json ./

COPY ./dist ./src

COPY ./LICENSE ./

RUN npm install --only=production

CMD ["npm", "start"]
