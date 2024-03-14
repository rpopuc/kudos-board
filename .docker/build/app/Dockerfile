FROM node:lts-alpine3.17

RUN apk add bash
RUN apk add jq

RUN npm install -g npm@10.5.0

USER 1000

WORKDIR /var/www/