import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';

const router = express.Router();

/* =====================================================
   CREATE USER (OWNER ONLY)
===================================================== */
router.post(
  '/create-user',
  authenticate,
  requireRole(['OWNER']),
  async (req, res) => {
    try {
      const { name, email, role } = req.body;

      if (!name || !email || !role) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // 🚫 OWNER cannot be created via API
      if (!['ADMIN', 'TEACHER', 'STUDENT'].includes(role)) {
        return res
          .status(400)
          .json({ message: 'Invalid role for creation' });
      }

      const exists = await User.findOne({ email });
      if (exists) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      const count = await User.countDocuments({ role });

      const prefixMap = {
        ADMIN: 'ADM',
        TEACHER: 'TEA',
        STUDENT: 'STD',
      };

      const universityId = `UNI-${prefixMap[role]}-${String(
        count + 1
      ).padStart(4, '0')}`;

      const hashedPassword = await bcrypt.hash('Welcome@123', 10);

      const user = await User.create({
        name,
        email,
        role,
        universityId,
        password: hashedPassword,
      });

      res.status(201).json({
        message: 'User created successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          universityId: user.universityId,
        },
      });
    } catch (err) {
      console.error('CREATE USER ERROR:', err);
      res.status(500).json({ message: 'Failed to create user' });
    }
  }
);

/* =====================================================
   STEP 3 — LIST ADMINS (OWNER ONLY)
===================================================== */
router.get(
  '/admins',
  authenticate,
  requireRole(['OWNER']),
  async (req, res) => {
    try {
      const admins = await User.find({ role: 'ADMIN' })
        .select('-password -otp -otpExpiry');

      res.json(admins);
    } catch (err) {
      console.error('GET ADMINS ERROR:', err);
      res.status(500).json({ message: 'Failed to fetch admins' });
    }
  }
);

/* =====================================================
   STEP 4 — ACTIVATE / DEACTIVATE USER (OWNER ONLY)
===================================================== */
router.patch(
  '/users/:id/status',
  authenticate,
  requireRole(['OWNER']),
  async (req, res) => {
    try {
      const { isActive } = req.body;

      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.isActive = Boolean(isActive);
      await user.save();

      res.json({
        message: 'User status updated',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
        },
      });
    } catch (err) {
      console.error('UPDATE STATUS ERROR:', err);
      res.status(500).json({ message: 'Failed to update status' });
    }
  }
);

/* =====================================================
   GET ALL USERS (OWNER & ADMIN)
===================================================== */
router.get(
  '/users',
  authenticate,
  requireRole(['OWNER', 'ADMIN']),
  async (req, res) => {
    try {
      const users = await User.find().select('-password -otp -otpExpiry');
      res.json(users);
    } catch (err) {
      console.error('GET USERS ERROR:', err);
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  }
);

export default router;
