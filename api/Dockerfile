FROM node:alpine
WORKDIR "/app"
COPY ./package.json ./
RUN apk add --no-cache make gcc g++ python && \
  npm install && \
  npm rebuild bcrypt --build-from-source && \
  apk del make gcc g++ python
COPY . .
CMD ["npm", "run", "start"]