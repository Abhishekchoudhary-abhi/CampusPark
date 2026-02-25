import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Routes
import slotRoutes from './routes/slots.js';
import zoneRoutes from './routes/zones.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import ownerRoutes from './routes/owner.js';




dotenv.config();

const app = express();

/* ==================== MONGOOSE CONFIG ==================== */
// 🔒 CRITICAL: prevent Mongoose from auto-recreating indexes
mongoose.set('autoIndex', false);

/* ==================== MIDDLEWARE ==================== */

// ✅ CORS (must come BEFORE routes)

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:5173",
      "https://campuspark-6xghjbqfi-abhishek-choudharys-projects-2b164f47.vercel.app"
      'https://campus-backend-4t1u.onrender.com'
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Parse JSON bodies
app.use(express.json({ limit: '10kb' }));

/* ==================== DATABASE ==================== */

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI not set in environment');
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Atlas connected'))
  .catch(err => {
    console.error('❌ MongoDB error:', err);
    process.exit(1);
  });

/* ==================== ROUTES ==================== */

// 🔐 Auth & Admin
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/owner', ownerRoutes);

// 🚗 Core app routes
app.use('/api/slots', slotRoutes);
app.use('/api/zones', zoneRoutes);

// ✅ Health check
app.get('/', (req, res) => {
  res.status(200).send('CampusPark Backend is running');
});

/* ==================== ERROR HANDLER ==================== */

// Catch unknown routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

/* ==================== SERVER ==================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
