FROM node:lts AS bootstrap
ARG gh_token

WORKDIR /app
RUN echo "//npm.pkg.github.com/:_authToken=${gh_token}" >> ~/.npmrc
RUN echo "@bdsi-utwente:registry=https://npm.pkg.github.com/" >> ~/.npmrc
COPY ./package.json .

RUN npm install


FROM node:lts AS app

WORKDIR /app
COPY --from=bootstrap /app/node_modules ./node_modules
COPY --from=bootstrap /app/package.json .
COPY ./dist/api.js ./dist/api.js

EXPOSE 3000
CMD [ "node", "dist/api.js" ]
