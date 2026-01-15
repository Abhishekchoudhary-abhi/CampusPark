import User from '../models/User.js';
import bcrypt from 'bcryptjs';

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
      active: true, // keep existing field
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
    // ✅ fetch only active admins
    const admins = await User.find({
      role: 'ADMIN',
      active: true,
    }).select('_id name email active');

    res.json(
      admins.map(a => ({
        id: a._id,
        name: a.name,
        email: a.email,
        enabled: a.active,
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
    if (admin.active) {
      const activeAdmins = await User.countDocuments({
        role: 'ADMIN',
        active: true,
      });

      if (activeAdmins <= 1) {
        return res
          .status(400)
          .json({ message: 'At least one admin must remain active' });
      }
    }

    admin.active = !admin.active;
    await admin.save();

    res.json({
      message: 'Admin status updated',
      enabled: admin.active,
    });
  } catch (err) {
    console.error('TOGGLE ADMIN ERROR:', err);
    res.status(500).json({ message: 'Failed to update admin' });
  }
};
