FROM node:9
# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g cnpm --registry=http://registry.npm.taobao.org

RUN cnpm install

COPY . .

RUN cd admin && cnpm install && npm run build
RUN cd system && cnpm install && npm run build


EXPOSE 80

CMD [ "npm","run", "app" ]