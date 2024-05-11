FROM node:latest

WORKDIR /docker-backend

COPY package*.json tsconfig.json ./

RUN npm install

COPY . ./

RUN npx prisma generate

ENTRYPOINT [ "npm", "run", "dev" ]

EXPOSE 3000