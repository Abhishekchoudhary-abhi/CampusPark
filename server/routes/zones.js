import express from 'express';
import Zone from '../models/Zone.js';

const router = express.Router();



/* -------- GET all zones (exclude deleted) -------- */
router.get('/', async (req, res) => {
  try {
    const zones = await Zone.find({ isDeleted: false });
    res.json(zones);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* -------- GET deleted zones (optional, admin use) -------- */
router.get('/deleted', async (req, res) => {
  try {
    const zones = await Zone.find({ isDeleted: true });
    res.json(zones);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* -------- CREATE zone -------- */
router.post('/', async (req, res) => {
  try {
    const zone = new Zone(req.body);
    await zone.save();
    res.status(201).json(zone);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* -------- UPDATE zone -------- */
router.put('/:id', async (req, res) => {
  try {
    const updatedZone = await Zone.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedZone) {
      return res.status(404).json({ message: 'Zone not found' });
    }

    res.json(updatedZone);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* -------- SOFT DELETE zone -------- */
router.delete('/:id', async (req, res) => {
  try {
    const zone = await Zone.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

    if (!zone) {
      return res.status(404).json({ message: 'Zone not found' });
    }

    res.json({ message: 'Zone deleted', zone });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* -------- RESTORE zone -------- */
router.post('/:id/restore', async (req, res) => {
  try {
    const zone = await Zone.findByIdAndUpdate(
      req.params.id,
      { isDeleted: false },
      { new: true }
    );

    if (!zone) {
      return res.status(404).json({ message: 'Zone not found' });
    }

    res.json(zone);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
