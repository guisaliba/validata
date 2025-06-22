FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install && npm install -g @nestjs/cli

COPY . .
RUN npm run build
