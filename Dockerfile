# Note while using Docker & Docker-Compose, change the mongo_uri from .env file to the one you want to use
FROM ubuntu:20.04

WORKDIR /app

# Install cron, git 
RUN apt-get update 
RUN apt-get install -y git

# Installing Node.js
RUN apt-get -y install curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_14.x  | bash -
RUN apt-get -y install nodejs

# Install web-app dependencies
COPY package*.json ./
RUN npm install

# Copy all web-app source files
COPY . .

EXPOSE 5000

# Grant execute permission for all scripts
RUN chmod +x ./scripts/*.sh

# Build frontend
WORKDIR /app/client

RUN /app/scripts/build-frontend.sh

WORKDIR /app

RUN set -xe && \
    apt-get update && \
    apt-get install -y python3-pip

RUN pip3 install -r ./ml_model/requirements.txt

RUN python3 ./ml_model/run.py 51 1 2 110 175 0 1 123 0 0.6 2 0 2

CMD [ "npm", "run", "server:prod" ]