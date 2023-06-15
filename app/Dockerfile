FROM node:lts


WORKDIR /app

RUN npm install -g sirv-cli
COPY ./public ./public

EXPOSE 8080
CMD [ "sirv", "public", "--host", "--single" ]
