# 🚗 CampusPark  
## Campus Parking Assistance & Administration System
![GitHub repo size](https://img.shields.io/github/repo-size/Abhishekchoudhary-abhi/CampusPark)
![GitHub stars](https://img.shields.io/github/stars/Abhishekchoudhary-abhi/CampusPark?style=social)
![GitHub forks](https://img.shields.io/github/forks/Abhishekchoudhary-abhi/CampusPark?style=social)
![GitHub last commit](https://img.shields.io/github/last-commit/Abhishekchoudhary-abhi/CampusPark)

![React](https://img.shields.io/badge/Frontend-React-blue)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![Vite](https://img.shields.io/badge/Build-Vite-purple)


CampusPark is a **full-stack, role-based parking management system** designed for campus environments.  
It enables **secure administration**, **real-time parking management**, and **efficient slot allocation** using modern web technologies.

---

## 📌 Key Features

### 👑 Owner
- Add new Admin users
- Enable / Disable Admin accounts
- Central system control
- *(Planned)* Audit logs

### 🛠 Admin
- Manage parking zones
- Add / remove parking slots
- Update slot availability
- Monitor parking usage

### 👤 User / Teacher
- View available parking slots
- Reserve parking spots
- Receive parking notifications

---

## 🏗️ Tech Stack

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- Context API (Authentication)
- Role-based UI rendering

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- bcrypt (Password hashing)
- CORS

---

## 📐 System Architecture

Frontend (React + TypeScript)
|
| HTTPS + JWT
▼
Backend (Node.js + Express)
|
▼
Database (MongoDB)


---

## 📁 Project Structure

CAMPUSPARK-BACKEND/
│
├── components/ # Frontend UI components
│ ├── owner/
│ │ ├── AdminList.tsx
│ │ └── AddAdminModal.tsx
│ ├── AdminDashboard.tsx
│ ├── OwnerDashboard.tsx
│ ├── TeacherDashboard.tsx
│ ├── UserDashboard.tsx
│ ├── Login.tsx
│ ├── Navbar.tsx
│ └── Sidebar.tsx
│
├── context/ # Authentication & route protection
│ ├── AuthContext.tsx
│ └── ProtectedRoute.tsx
│
├── services/ # Frontend services
│ ├── storageService.ts
│ └── geminiService.ts
│
├── server/ # Backend
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ └── index.js
│
├── App.tsx # Main frontend component
├── index.tsx # Frontend entry point
├── index.html # Vite entry file
└── README.md


---

## ⚡ Build Tool – Vite

Vite is used **only for the frontend**.

### Why Vite?
- Fast development server
- Instant Hot Module Replacement (HMR)
- Optimized production builds
- Native ES module support

### Vite Commands
```bash
npm run dev       # Start frontend dev server
npm run build     # Build frontend
npm run preview   # Preview production build
🔐 Authentication & Authorization
JWT-based authentication

Role-based access control (OWNER, ADMIN, USER)

Secure password hashing using bcrypt

Protected API routes via middleware

🌐 API Overview
Authentication
Method	Endpoint	Description
POST	/api/auth/login	User login
POST	/api/auth/register	User registration
Owner
Method	Endpoint	Description
GET	/api/owner/admins	Fetch admins
POST	/api/owner/users	Create admin
PATCH	/api/owner/admins/:id	Enable / Disable admin
Parking
Method	Endpoint	Description
GET	/api/zones	Get zones
GET	/api/slots	Get slots
POST	/api/slots	Add slot
⚙️ Setup Instructions
Backend
cd server
npm install
npm run dev
Create .env:

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
Frontend
npm install
npm run dev
Runs on: http://localhost:3000

🚀 Deployment
Backend: Render

Frontend: Vercel / Netlify

Database: MongoDB Atlas

🔮 Future Enhancements
Audit logging

Real-time updates (WebSockets)

Slot auto-release

Analytics dashboard

Mobile app support

👨‍💻 Author
Abhishek Choudhary
GitHub: @Abhishekchoudhary-abhi

