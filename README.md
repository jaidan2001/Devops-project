# 🚀 MEAN Stack Application – DevOps Deployment Project  
A complete DevOps pipeline implementation using **Docker**, **Docker Compose**, **Nginx**, **GitHub Actions CI/CD**, and **AWS EC2**.

This project includes:

- Frontend (Angular)
- Backend (Node.js / Express)
- MongoDB Database
- Docker containerization for all services
- Docker Compose multi-container deployment
- CI/CD Pipeline using GitHub Actions
- Deployment to AWS EC2 (Ubuntu VM)
- Nginx reverse proxy on port 80

---

# 📌 1. Folder Structure

<img width="379" height="942" alt="image" src="https://github.com/user-attachments/assets/adc84dde-7653-4874-8bb6-3fc2c54837f5" />



---

# 📌 2. Dockerfiles

## 🟦 **Backend Dockerfile**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]

## 🟦 **Frontend Dockerfile**

FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --prod

FROM nginx:alpine
COPY --from=build /app/dist/* /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

## 🟦 **Docker Compose Configuration**

version: "3"

services:
  mongo:
    image: mongo:6
    container_name: mongo
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: rootpass
    volumes:
      - mongo_data:/data/db
    ports:
      - "27017:27017"

  backend:
    image: akirazephyr/mean-backend:v1
    container_name: backend
    restart: always
    depends_on:
      - mongo
    environment:
      MONGO_URL: mongodb://root:rootpass@mongo:27017/
    ports:
      - "3000:3000"

  frontend:
    image: akirazephyr/mean-frontend:v1
    container_name: frontend
    restart: always
    ports:
      - "4200:80"

volumes:
  mongo_data:


 ## 🟦 **CI/CD Pipeline – GitHub Actions**

name: CI/CD Pipeline

on:
  push:
    branches: [ "main" ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Login to DockerHub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}

    - name: Build and Push Backend
      run: |
        docker build -t ${{ secrets.DOCKER_USERNAME }}/mean-backend:latest ./backend
        docker push ${{ secrets.DOCKER_USERNAME }}/mean-backend:latest

    - name: Build and Push Frontend
      run: |
        docker build -t ${{ secrets.DOCKER_USERNAME }}/mean-frontend:latest ./frontend
        docker push ${{ secrets.DOCKER_USERNAME }}/mean-frontend:latest

    - name: SSH into EC2 and deploy
      uses: appleboy/ssh-action@v0.1.6
      with:
        host: ${{ secrets.VM_HOST }}
        username: ${{ secrets.VM_USER }}
        key: ${{ secrets.VM_SSH_KEY }}
        script: |
          cd app
          docker-compose pull
          docker-compose up -d


##  **AWS EC2 Deployment Steps**
🟣 1. Create Ubuntu VM (EC2)
Ubuntu 22.04 LTS

t2.micro

Allow ports 22, 80, 3000, 4200


## ** Screenshot - Install dependencies**
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/8656bebc-a17b-42bf-b84a-92443ce3f538" />

## ** Screenshot - Install dependencies**
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/9f6b24a6-e8e9-4d78-b698-14dc3fdb8768" />

## ** Screenshot - Create deployment and deploy**
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/2a58c1ec-20b8-4e35-ab8b-2cbadb428bbc" />
