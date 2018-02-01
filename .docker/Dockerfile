FROM node:8

RUN mkdir -p /nodedeps/node_modules

WORKDIR /nodedeps
COPY package*.json . /

RUN npm install

WORKDIR /app

ENV NODE_PATH=/nodedeps/node_modules

CMD ["npm", "start"]