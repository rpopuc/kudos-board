FROM node:lts-alpine3.19

RUN apk add bash
RUN apk add jq

RUN npm install -g npm@10.5.0

COPY entrypoint.sh /
RUN  chmod +x /entrypoint.sh

VOLUME [ "/var/www/" ]

USER 1000

WORKDIR /var/www/

ENTRYPOINT [ "/entrypoint.sh" ]