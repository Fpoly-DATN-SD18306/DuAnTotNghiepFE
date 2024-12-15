# Sử dụng Node.js image làm base image
FROM node:20

# Thiết lập thư mục làm việc
WORKDIR /usr/app

# Copy toàn bộ source code vào container
COPY . .

# Cài đặt dependencies
RUN npm install

RUN npm i @angular/cli

RUN rm -rf node_modules

RUN rm -f package-lock.json

RUN npm install

RUN npm install esbuild@latest

# Expose cổng 4200 cho Angular
EXPOSE 4200

CMD [ "npm","start" ]

