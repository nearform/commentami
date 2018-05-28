FROM node:8.11.2-alpine

WORKDIR /usr/app

COPY . .

RUN npm install --quiet
