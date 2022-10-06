FROM nginx:latest
EXPOSE 80
WORKDIR /nginx
RUN rm -rf /etc/nginx/nginx.conf 
COPY ./nginx.conf /etc/nginx/
CMD ["nginx", "-g", "daemon off;"]