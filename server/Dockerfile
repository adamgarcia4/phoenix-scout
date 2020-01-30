FROM node:12-alpine as base

WORKDIR /var/build

#------ PRE-REQS --------
FROM base as prereq

COPY package*.json ./
COPY ts*.json ./

RUN npm install --quiet --unsafe-perm --no-progress --no-audit --only=production

#--------- DEVELOPMENT -----------
FROM prereq as development

RUN npm install --quiet --unsafe-perm --no-progress --no-audit --only=development

## All files will be volume mounted into the container
EXPOSE 8080