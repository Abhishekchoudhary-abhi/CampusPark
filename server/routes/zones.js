import express from 'express';
import Zone from '../models/Zone.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const zones = await Zone.find();
  res.json(zones);
});

router.post('/', async (req, res) => {
  const zone = new Zone(req.body);
  await zone.save();
  res.json(zone);
});

export default router;
