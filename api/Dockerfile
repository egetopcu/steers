FROM node:lts


WORKDIR /app

COPY package.json .
COPY .npmrc .

RUN npm install

COPY ./lib ./lib

EXPOSE 3000
CMD [ "node", "lib/app.js" ]
