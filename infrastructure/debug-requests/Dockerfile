FROM node:17.6.0-alpine3.14

RUN mkdir /app
WORKDIR /app

RUN mkdir node_modules

COPY node_modules ./node_modules
COPY index.js .

EXPOSE 8090
ENTRYPOINT ["node", "index.js"]