# FROM node:12-alpine as base
FROM arm32v7/node:12 as base

WORKDIR /workdir/server

#------ PRE-REQS --------
FROM base as prereq

COPY package*.json ./
COPY ts*.json ./

RUN npm install --quiet --unsafe-perm --no-progress --no-audit --only=production

#--------- DEVELOPMENT -----------
FROM prereq as development

RUN npm install --quiet --unsafe-perm --no-progress --no-audit --only=development

# ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
# RUN chmod +x /wait
## All files will be volume mounted into the container
EXPOSE 8080

CMD npm run debug
# CMD /wait && npm run debug