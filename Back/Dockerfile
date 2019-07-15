FROM node:8.16-jessie

RUN mkdir /api

WORKDIR /api

COPY package*.json /api/

RUN npm install && chmod -R 777 node_modules

COPY . /api/

EXPOSE 80

CMD ["npm", "start"]