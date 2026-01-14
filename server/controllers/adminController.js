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
    });

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'User creation failed' });
  }
};
