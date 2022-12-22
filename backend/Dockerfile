FROM nikolaik/python-nodejs:latest

WORKDIR /backend

COPY package*.json ./
RUN npm install

ENV DB_HOST db

COPY . . 

EXPOSE 4000
CMD [ "npm", "start" ]