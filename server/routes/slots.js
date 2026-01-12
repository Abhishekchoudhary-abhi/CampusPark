import express from 'express';
import Slot from '../models/Slot.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const slots = await Slot.find();
  res.json(slots);
});

router.post('/', async (req, res) => {
  const slot = new Slot(req.body);
  await slot.save();
  res.json(slot);
});

export default router;
