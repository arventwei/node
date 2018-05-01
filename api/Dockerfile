FROM node:9
# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g cnpm --registry=http://registry.npm.taobao.org
RUN cnpm install

COPY . .

#RUN cd web && cd front && npm install && npm run build


EXPOSE 7110

CMD [ "npm","run", "app" ]