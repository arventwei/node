FROM node:9
# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN cd admin && npm install && npm run build
RUN cd system && npm install && npm run build


EXPOSE 80

CMD [ "npm","run", "app" ]