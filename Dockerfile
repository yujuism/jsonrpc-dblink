# Base image
FROM node:18-alpine

RUN apk update && apk add git

ENV LOG_MODE=${LOG_MODE}
ENV NODE_ENV=${NODE_ENV}
ENV PORT=${PORT}
ENV DB_USER=${DB_USER}
ENV DB_PASSWORD=${DB_PASSWORD}
ENV DB_NAME=${DB_NAME}
ENV DB_HOST=${DB_HOST}
ENV DB_PORT=${DB_PORT}
ENV API_KEY=${API_KEY}
ENV ELASTICSEARCH_URL=${ELASTICSEARCH_URL}
ENV ELASTICSEARCH_USERNAME=${ELASTICSEARCH_USERNAME}
ENV ELASTICSEARCH_PASSWORD=${ELASTICSEARCH_PASSWORD}
ENV REDIS_STORE=${REDIS_STORE}
ENV REDIS_PORT=${REDIS_PORT}
ENV REDIS_PASSWORD=${REDIS_PASSWORD}
ENV DB_MODULE=${DB_MODULE}
ENV COMMAND_HANDLER=${COMMAND_HANDLER}
ENV QUERY_HANDLER=${QUERY_HANDLER}
ENV COMMAND_METHOD_OVERRIDE=${COMMAND_METHOD_OVERRIDE}
ENV QUERY_METHOD_OVERRIDE=${QUERY_METHOD_OVERRIDE}

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

# Start the server using the production build
CMD [ "node", "dist/main.js" ]