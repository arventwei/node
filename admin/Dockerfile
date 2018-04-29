FROM node:9
# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN cd src && npm install && npm run build


EXPOSE 7310

CMD [ "npm","run", "api" ]