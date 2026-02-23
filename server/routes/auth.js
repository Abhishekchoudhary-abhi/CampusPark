import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/* =====================================================
   USER SELF-REGISTRATION (PUBLIC)
   ROLE IS FORCED TO TEACHER
===================================================== */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'TEACHER', // ✅ SAFE DEFAULT ROLE
      isActive: true,
    });

    // Auto-login after register (optional but recommended)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30m' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('REGISTER ERROR:', err);
    res.status(500).json({ message: 'Registration failed' });
  }
});

/* =====================================================
   LOGIN (UNCHANGED)
===================================================== */
router.post('/login', async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: 'Request body missing' });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email, isActive: true }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30m' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        universityId: user.universityId,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

/* =====================================================
   CHANGE PASSWORD (UNCHANGED)
===================================================== */
router.put('/change-password', authenticate, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Missing password fields' });
    }

    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Wrong old password' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password updated' });
  } catch (err) {
    console.error('CHANGE PASSWORD ERROR:', err);
    res.status(500).json({ message: 'Failed to change password' });
  }
});

/* =====================================================
   FORGOT PASSWORD (OTP) (UNCHANGED)
===================================================== */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    console.log('OTP:', user.otp); // replace with email service

    res.json({ message: 'OTP sent' });
  } catch (err) {
    console.error('FORGOT PASSWORD ERROR:', err);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

/* =====================================================
   VERIFY OTP (UNCHANGED)
===================================================== */
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
      otp,
      otpExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    res.json({ message: 'OTP verified' });
  } catch (err) {
    console.error('VERIFY OTP ERROR:', err);
    res.status(500).json({ message: 'OTP verification failed' });
  }
});

/* =====================================================
   RESET PASSWORD (UNCHANGED)
===================================================== */
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('RESET PASSWORD ERROR:', err);
    res.status(500).json({ message: 'Password reset failed' });
  }
});

/* =====================================================
   CREATE ADMIN / TEACHER (OWNER ONLY) — UNCHANGED
===================================================== */
router.post('/create-user', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'OWNER') {
      return res.status(403).json({ message: 'Only OWNER can create users' });
    }

    const { name, email, password, role } = req.body;

    if (!['ADMIN', 'TEACHER'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      isActive: true,
    });

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('CREATE USER ERROR:', err);
    res.status(500).json({ message: 'User creation failed' });
  }
});

export default router;
