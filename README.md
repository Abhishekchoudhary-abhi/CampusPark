🚗 CampusPark
Campus Parking Assistance & Administration System

CampusPark is a full-stack role-based parking management system designed for campus environments.
It enables secure administration, real-time parking management, and efficient slot allocation using modern web technologies.

📌 Key Features
👑 Owner

Add new Admin users

Enable / Disable Admin accounts

Central system control

(Planned) Audit logs

🛠 Admin

Manage parking zones

Add / remove parking slots

Update slot availability

Monitor parking usage

👤 User / Teacher

View available parking slots

Reserve parking spots

Receive parking notifications

🏗️ Tech Stack
Frontend

React + TypeScript

Vite

Tailwind CSS

Context API (Authentication)

Role-based UI rendering

Backend

Node.js

Express.js

MongoDB

JWT Authentication

bcrypt (Password hashing)

CORS

📐 System Architecture
Frontend (React + TS)
        |
        |  HTTPS + JWT
        ▼
Backend (Node + Express)
        |
        ▼
Database (MongoDB)

📁 Project Structure

CAMPUSPARK-BACKEND/
│
├── components/                 # Frontend UI components
│   ├── owner/
│   │   ├── AdminList.tsx
│   │   └── AddAdminModal.tsx
│   │
│   ├── AdminDashboard.tsx
│   ├── OwnerDashboard.tsx
│   ├── TeacherDashboard.tsx
│   ├── UserDashboard.tsx
│   ├── CreateAdmin.tsx
│   ├── Login.tsx
│   ├── Navbar.tsx
│   └── Sidebar.tsx
│
├── context/                    # Global state & auth handling
│   ├── AuthContext.tsx
│   └── ProtectedRoute.tsx
│
├── services/                   # Frontend API & utility services
│   ├── storageService.ts
│   └── geminiService.ts
│
├── server/                     # Backend (Node + Express)
│   ├── controllers/
│   │   ├── adminController.js
│   │   └── authController.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   └── role.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Slot.js
│   │   └── Zone.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── admin.js
│   │   ├── owner.js
│   │   ├── slots.js
│   │   └── zones.js
│   │
│   ├── index.js                # Backend entry point
│   └── package.json
│
├── App.tsx                     # Main frontend component
├── index.tsx                   # Frontend entry point
├── index.html                  # Vite HTML entry
├── constants.ts
├── capacitor.config.ts
├── package.json
└── README.md
⚡ Build Tool – Vite

Vite is used only for the frontend in this project.

Responsibilities of Vite

Runs the frontend development server

Handles hot module replacement (HMR)

Builds the production-ready frontend

Loads React components using native ES modules

Vite Commands Used
npm run dev       # Start frontend development server
npm run build     # Build frontend for production
npm run preview   # Preview production build


The backend does not use Vite and runs independently using Node.js and Express.

🔐 Authentication & Authorization

CampusPark uses JWT-based authentication with role-based authorization.

Authentication Flow

User logs in with credentials

Backend validates credentials

JWT token is issued

Token is sent with every API request

Backend verifies token before processing request

Authorization

Routes are protected using middleware

Access is restricted based on user roles:

OWNER

ADMIN

TEACHER / USER

🌐 API Overview
Authentication
Method	Endpoint	Description
POST	/api/auth/login	Login user
POST	/api/auth/register	Register user
Owner Routes
Method	Endpoint	Description
GET	/api/owner/admins	Get all admins
POST	/api/owner/users	Create admin
PATCH	/api/owner/admins/:id	Enable/Disable admin
Parking Routes
Method	Endpoint	Description
GET	/api/zones	Get parking zones
GET	/api/slots	Get parking slots
POST	/api/slots	Add parking slot
⚙️ Setup Instructions
1️⃣ Clone Repository
git clone https://github.com/Abhishekchoudhary-abhi/CampusPark.git
cd CampusPark

2️⃣ Backend Setup
cd server
npm install


Create .env file:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key


Run backend:

npm run dev

3️⃣ Frontend Setup
npm install
npm run dev


Frontend will run on:

http://localhost:3000

🚀 Deployment

Backend: Render

Frontend: Vercel / Netlify

Database: MongoDB Atlas

🛡️ Security Features

Password hashing using bcrypt

JWT token expiration

Role-based route protection

CORS configuration

Secure API access

📌 Current Limitations

Audit logs not fully implemented

Real-time updates are refresh-based

Mobile UI optimization pending

🔮 Future Enhancements

Audit logging system

WebSocket-based real-time updates

Slot auto-release timer

Admin analytics dashboard

Mobile application support

🎓 Academic Relevance

This project is suitable for:

Final year engineering projects

Full-stack development labs

Software architecture demonstrations

MERN stack learning

👨‍💻 Author

Abhishek Choudhary
GitHub: @Abhishekchoudhary-abhi


