FROM node:12-alpine as base
# FROM arm32v7/node:12 as base

WORKDIR /workdir/frontend

#------ PRE-REQS --------
FROM base as prereq

COPY package*.json ./
COPY ts*.json ./
COPY webpack.config.js ./
COPY ./public/ ./public
COPY ./build-utils ./build-utils
COPY ./server.js ./server.js

RUN npm install --quiet --unsafe-perm --no-progress --no-audit --only=production

#--------- DEVELOPMENT -----------
FROM prereq as development

RUN npm install --quiet --unsafe-perm --no-progress --no-audit --only=development

## All files will be volume mounted into the container
EXPOSE 3000