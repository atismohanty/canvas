# Stage1 build base image
# FROM centos
# Stage2 build angular

FROM node:14-alpine as base
WORKDIR /canvasui_docker
RUN rm -rf /canvasui_docker/dist/canvasUI
COPY ./package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build-prod
  # CMD ["/bin", "/bash"]
FROM nginx
EXPOSE 80
RUN rm -rf /etc/nginx/nginx.conf
COPY ./nginx.conf /etc/nginx/
COPY ./certs /etc/nginx/certs
COPY --from=base /canvasui_docker/dist/canvasUI /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
# ENTRYPOINT ['bash']

# COPY ./dist/canvasUI ./etc/nginx/html/
#   # COPY dist/canvasUI  /etc/nginx/html/