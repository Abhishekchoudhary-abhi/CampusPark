
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';   // ← ADD THIS

/**
 * CREATE ADMIN / TEACHER
 * ONLY OWNER CAN CALL THIS
 */
export const createUserByOwner = async (req, res) => {
  try {
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
      isActive: true, // ✅ FIXED (was active)
    });

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('CREATE USER ERROR:', err);
    res.status(500).json({ message: 'User creation failed' });
  }
};


/**
 * GET ALL ADMINS
 * ONLY OWNER CAN CALL THIS
 */
export const getAdmins = async (req, res) => {
  try {
    console.log("CONNECTED DB:", mongoose.connection.name);

    const allUsers = await User.find();
    console.log("ALL USERS:", allUsers);

    const admins = await User.find({ role: 'ADMIN' });

    console.log("ADMINS FOUND:", admins);

    res.json(
      admins.map(a => ({
        id: a._id.toString(),
        name: a.name,
        email: a.email,
        enabled: a.isActive ?? true,
      }))
    );
  } catch (err) {
    console.error('GET ADMINS ERROR:', err);
    res.status(500).json({ message: 'Failed to load admins' });
  }
};


/**
 * ENABLE / DISABLE ADMIN
 * ONLY OWNER CAN CALL THIS
 */
export const toggleAdminStatus = async (req, res) => {
  try {
    const admin = await User.findById(req.params.id);

    if (!admin || admin.role !== 'ADMIN') {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // 🔒 prevent disabling last active admin
    if (admin.isActive) { // ✅ FIXED
      const activeAdmins = await User.countDocuments({
        role: 'ADMIN',
        isActive: true, // ✅ FIXED
      });

      if (activeAdmins <= 1) {
        return res.status(400).json({
          message: 'At least one admin must remain active',
        });
      }
    }

    admin.isActive = !admin.isActive; // ✅ FIXED
    await admin.save();

    res.json({
      message: 'Admin status updated',
      enabled: admin.isActive,
    });
  } catch (err) {
    console.error('TOGGLE ADMIN ERROR:', err);
    res.status(500).json({ message: 'Failed to update admin' });
  }
};

/**
 * DELETE ADMIN
 * ONLY OWNER CAN CALL THIS
 */
export const deleteAdmin = async (req, res) => {
  try {
    const admin = await User.findById(req.params.id);

    if (!admin || admin.role !== 'ADMIN') {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // 🔒 prevent deleting last active admin
    const activeAdmins = await User.countDocuments({
      role: 'ADMIN',
      isActive: true,
    });

    if (admin.isActive && activeAdmins <= 1) {
      return res.status(400).json({
        message: 'Cannot delete the last active admin',
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'Admin deleted successfully' });
  } catch (err) {
    console.error('DELETE ADMIN ERROR:', err);
    res.status(500).json({ message: 'Failed to delete admin' });
  }
};