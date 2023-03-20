FROM nginx:alpine
LABEL maintainers="ChengXiangdong"
LABEL description="Provider Management UI"

RUN rm -rf /usr/share/nginx/html/*
COPY dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
