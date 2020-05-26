FROM node:current-slim

MAINTAINER "dengtao"<981376577@qq.com>

RUN mkdir -p /home/react

WORKDIR /home/react

COPY . /home/react

RUN npm install

EXPOSE 9528

CMD npm start
