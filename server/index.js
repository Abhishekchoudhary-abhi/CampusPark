import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import slotRoutes from './routes/slots.js';
import zoneRoutes from './routes/zones.js';

dotenv.config();

const app = express();

// ✅ CORS (SAFE FOR RENDER + ANDROID)
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://campuspark-backend.onrender.com"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// ✅ MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Atlas connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ✅ Routes
app.use('/api/slots', slotRoutes);
app.use('/api/zones', zoneRoutes);

// ✅ Render-safe port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
