#FROM nginx:1.18 as base
#EXPOSE 80
FROM node:12.16-buster as build
WORKDIR /app

COPY ./package.json /app/
COPY ./ /app

RUN npm install

RUN npm install -g browserify
RUN npm install -g gulp-cli
#RUN npm run build

