import express from 'express';
import { authenticate as auth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';

import {
  createUserByOwner,
  getAdmins,
  toggleAdminStatus,
} from '../controllers/adminController.js';

const router = express.Router();

router.post('/users', auth, requireRole('OWNER'), createUserByOwner);
router.get('/admins', auth, requireRole('OWNER'), getAdmins);
router.patch('/admins/:id', auth, requireRole('OWNER'), toggleAdminStatus);

export default router;
