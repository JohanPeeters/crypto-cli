FROM node:10.11-alpine

RUN npm install -g crypto-assignment-check@1.3.0

ENTRYPOINT ["crypto-client"]
