# Posts App

A full-stack web application where users can create, view, react to, and manage posts. Built with Node.js, Express, MongoDB, and a modern React frontend.

## 🔧 Features

- User registration and login with JWT auth
- Create, edit, and delete your own posts
- View all public posts
- React to posts with multiple reaction types
- Upload post images
- Responsive UI built with MUI
- REST API with secure endpoints

## 🚀 Tech Stack

### Frontend
- React
- React Router
- Axios
- Framer Motion
- Toastify
- MUI

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Cludinary API for image uploads

## 📂 Project Structure
client/          # React frontend
├── components/
├── pages/
├── services/
└── App.js

server/          # Node.js backend
├── controllers/
├── routes/
├── models/
└── middleware/

## 🏁 Getting Started

Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/posts-app.git
cd posts-app

- Backend Setup
cd server
npm install
npm run dev

- Frontend Setup
cd client
npm install
npm run dev

- Environment Variables : Create a .env file in the server/ folder:

MONGO_URI=your_mongo_connection
JWT_SECRET=your_secret_key
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

