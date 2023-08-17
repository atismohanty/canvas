FROM nginx:latest
EXPOSE 80
RUN rm -rf /etc/nginx/conf.d
RUN rm -rf /etc/nginx/nginx.conf
COPY ./nginx.conf /etc/nginx/
COPY ./certs /etc/nginx/certs
CMD ["nginx", "-g", "daemon off;"]