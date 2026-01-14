import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';

const router = express.Router();

/* =====================================================
   CREATE USER (OWNER ONLY)
   - OWNER can create ADMIN / TEACHER / STUDENT
   - UNIVERSITY ID auto-generated
   - Default password assigned
===================================================== */
router.post(
  '/create-user',
  authenticate,
  requireRole(['OWNER']),
  async (req, res) => {
    try {
      const { name, email, role } = req.body;

      // 🔒 Basic validation
      if (!name || !email || !role) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      if (!['OWNER', 'ADMIN', 'TEACHER', 'STUDENT'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
      }

      // Prevent duplicate email
      const exists = await User.findOne({ email });
      if (exists) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      // Count existing users by role
      const count = await User.countDocuments({ role });

      // Role-based prefix
      const prefixMap = {
        OWNER: 'OWN',
        ADMIN: 'ADM',
        TEACHER: 'TEA',
        STUDENT: 'STD',
      };

      const universityId = `UNI-${prefixMap[role]}-${String(
        count + 1
      ).padStart(4, '0')}`;

      // Default password (must be changed after login)
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
   GET USERS
   - OWNER & ADMIN only
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
