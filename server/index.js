import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import slotRoutes from './routes/slots.js';
import zoneRoutes from './routes/zones.js';

dotenv.config();

const app = express();

// ✅ CORS — SAFE & FLEXIBLE (won't break anything)
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://campus-backend-4t1u.onrender.com" // ✅ CORRECT backend domain
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// ✅ MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Atlas connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ✅ Routes (ORDER IS CORRECT)
app.use('/api/slots', slotRoutes);
app.use('/api/zones', zoneRoutes);

// ✅ Health check (VERY useful)
app.get('/', (req, res) => {
  res.send('CampusPark Backend is running');
});

// ✅ Render-safe port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
