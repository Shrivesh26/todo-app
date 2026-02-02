# Todo App – Backend

This is the **backend** of a Todo Application built using **Node.js, Express, MongoDB, and JWT authentication**.  
It follows an **MVC architecture** with proper separation of routes, controllers, models, and middleware.

The backend exposes REST APIs used by the frontend for authentication and todo management.

---

## 📁 Backend Folder Structure

Backend/
├── config/
│ └── db.js
├── controllers/
│ ├── userController.js
│ └── todoController.js
├── middleware/
│ └── authorize.js
├── models/
│ ├── user.js
│ └── todo.js
├── routes/
│ ├── userRoutes.js
│ └── todoRoutes.js
├── jwt/
│ └── token.js
├── index.js
├── .env
├── .gitignore
├── package.json
└── README.md

---

## 🛠️ Tech Stack (Backend)

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Token)
- bcrypt
- dotenv

---

## 🚀 Features

### 🔐 Authentication
- User registration
- User login
- Password hashing using bcrypt
- JWT-based authentication
- Protected routes using middleware

### 📝 Todo Management
- Create todo
- Read todos (user-specific)
- Update todo
- Delete todo

### 🧱 Architecture
- MVC pattern
- Centralized database configuration
- Middleware-based authorization
- Clean and scalable structure

---

## ⚙️ Backend Setup

### 1️⃣ Navigate to Backend folder
```bash
cd Backend

### 2️⃣ Install dependencies
npm install

### 3️⃣ Create .env file
Create a .env file in the Backend root directory.

PORT=4001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

### 4️⃣ Start the server
npm start

Server will run at:

http://localhost:4001

``` 
### 🧪 API Endpoints

#### Auth Routes
POST   /api/user/register
POST   /api/user/login
GET    /api/user/logout

#### Todo Routes (Protected)
GET    /api/todo
POST   /api/todo
PUT    /api/todo/:id
DELETE /api/todo/:id

