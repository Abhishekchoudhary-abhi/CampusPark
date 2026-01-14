import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';

const router = express.Router();

/* ---------- CREATE USER (OWNER ONLY) ---------- */
router.post(
  '/create-user',
  authenticate,
  requireRole(['OWNER']),
  async (req, res) => {
    const count = await User.countDocuments({ role: req.body.role });
    const prefix = {
      OWNER: 'OWN',
      ADMIN: 'ADM',
      TEACHER: 'TEA',
      STUDENT: 'STD',
    }[req.body.role];

    const user = new User({
      ...req.body,
      universityId: `UNI-${prefix}-${String(count + 1).padStart(4, '0')}`,
      password: await bcrypt.hash('Welcome@123', 10),
    });

    await user.save();
    res.status(201).json(user);
  }
);

/* ---------- GET USERS ---------- */
router.get(
  '/users',
  authenticate,
  requireRole(['OWNER', 'ADMIN']),
  async (req, res) => {
    const users = await User.find();
    res.json(users);
  }
);

export default router;
