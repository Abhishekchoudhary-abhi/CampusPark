import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/* ---------- LOGIN ---------- */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, isActive: true }).select('+password');
  if (!user || !(await bcrypt.compare(password, user.password))) {
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
});

/* ---------- CHANGE PASSWORD ---------- */
router.put('/change-password', authenticate, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');
  if (!(await bcrypt.compare(oldPassword, user.password))) {
    return res.status(400).json({ message: 'Wrong old password' });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: 'Password updated' });
});

/* ---------- FORGOT PASSWORD (OTP) ---------- */
router.post('/forgot-password', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 min
  await user.save();

  console.log('OTP:', user.otp); // 🔥 replace with email service later

  res.json({ message: 'OTP sent' });
});

/* ---------- VERIFY OTP ---------- */
router.post('/verify-otp', async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
    otp: req.body.otp,
    otpExpiry: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ message: 'Invalid OTP' });

  res.json({ message: 'OTP verified' });
});

/* ---------- RESET PASSWORD ---------- */
router.post('/reset-password', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.password = await bcrypt.hash(req.body.newPassword, 10);
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  res.json({ message: 'Password reset successful' });
});

export default router;
