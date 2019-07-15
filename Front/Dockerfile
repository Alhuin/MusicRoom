FROM node:8.16-jessie

RUN mkdir -p /usr/app/client

WORKDIR /usr/app/client

COPY package*.json /usr/app/client/

RUN npm install

COPY . /usr/app/client/

EXPOSE 3000

CMD ["npm", "start"]

