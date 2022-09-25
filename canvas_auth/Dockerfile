FROM node:14-alpine as base
WORKDIR  /docker_canvasauth
ENV NODE_ENV dev
COPY ./package.json package-lock.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "start"]


