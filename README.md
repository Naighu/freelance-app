# Freelance Website

A full-stack freelance platform built with React (frontend) and Node.js (backend). It is currently in production and can access the website <a href="http://13.54.187.158/">here</a>.

## PR Request
- You can raise PR request and it will be merged to main when all the testcases have been passed.

## Features
- User authentication (workers & Clients)
- Work posting and applying system
- Profile management

## Project Structure
  - frontend contains react code
  - backend contains NodeJs code

## Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB (local or Atlas)


## Setup

### 1. Clone Repo
```bash
git clone https://github.com/Naighu/freelance-app.git
```

### 2. Backend Setup
#### 2.1: Install dependencies
```bash
cd backend
npm install
```

#### 2.2. Create .env file inside backend
```bash
MONGO_URI=<MONGODB_URL>
JWT_SECRET=<TOKEN>
PORT=<PORT>
ADMIN_TOKEN=<ADMIN TOKEN>
```

#### 2.3. Run the backend
```bash
npm start
```

### 3. Frontend Setup
   ```bash
cd frontend
```
#### 3.1. Update base URL
  - Update the base url of the backend app in the folder src/axiosConfig.jsx
```bash
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '<here>',
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
```
#### 3.2. Install dependencies and run the app
```bash
npm install
npm start
```

### CI/CD pipeline details
- Setup the github runner and environment variables.
- install nginx ,nvm, node and pm2
```bash
sudo apt install nginx nvm
nvm install 22
npm install -g pm2
```
- Build the frontend using yarn
```bash
yarn run build
```
- Configure nginx server
  - Copy the following to the /etc/nginx/sites-available/default file
  - Make sure to change the host and port if needed.
```bash
server {
	server_name _;
	location / {
		proxy_pass http://localhost:3000;
		proxy_set_header Host $host;
		proxy_set_header X-Real_IP $remote_addr;
		proxy_set_header X-Forwarded-for $proxy_add_x_forwarded_for;

	}
}
```
  - Restart nginx server
  ```bash
  sudo service nginx restart
  ```
- Start the pm2 instances
  ```bash
  cd backend
  pm2 start 'npm start' --name 'backend'
  cd ..
  pm2 serve build/ 3000 --name "frontend" --spa
    ```