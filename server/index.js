import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Routes
import slotRoutes from './routes/slots.js';
import zoneRoutes from './routes/zones.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();

/* ==================== MIDDLEWARE ==================== */

// ✅ CORS (must come BEFORE routes)
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://campus-backend-4t1u.onrender.com',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ✅ Parse JSON bodies
app.use(express.json());

/* ==================== DATABASE ==================== */

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Atlas connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

/* ==================== ROUTES ==================== */

// 🔐 Auth & Admin
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// 🚗 Core app routes
app.use('/api/slots', slotRoutes);
app.use('/api/zones', zoneRoutes);

// ✅ Health check
app.get('/', (req, res) => {
  res.send('CampusPark Backend is running');
});

/* ==================== SERVER ==================== */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
