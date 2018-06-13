FROM node:8.11.2-alpine

WORKDIR /usr/app

COPY . .

RUN sed -i 's/lerna bootstrap/lerna bootstrap -- --unsafe-perm/g' package.json

RUN npm install --unsafe-perm --quiet
