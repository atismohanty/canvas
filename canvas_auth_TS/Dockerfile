FROM node:16-alpine as base
WORKDIR  /docker_canvasauth
COPY ./package.json package-lock.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "start"]