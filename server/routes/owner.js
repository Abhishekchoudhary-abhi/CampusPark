import express from 'express';
import { getAdmins, toggleAdmin } from '../controllers/adminController.js';
import auth from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';

const router = express.Router();

// OWNER only
router.get('/admins', auth, requireRole('OWNER'), getAdmins);
router.patch('/admins/:id', auth, requireRole('OWNER'), toggleAdmin);

export default router;
