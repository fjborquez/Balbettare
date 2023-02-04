FROM node:16

WORKDIR /database

COPY package*.json ./
RUN npm install

ENV DB_HOST db

COPY . . 

EXPOSE 5000
CMD [ "npm", "start" ]