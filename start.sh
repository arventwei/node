docker-compose pull &&
docker-compose build --no-cache &&
docker-compose down &&
docker-compose up -d scale ns=4
