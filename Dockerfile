FROM node:16.17.0-alpine

WORKDIR /usr/neabi

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate

CMD ["npm", "run", "start"]
