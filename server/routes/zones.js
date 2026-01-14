import express from 'express';
import Zone from '../models/Zone.js';

const router = express.Router();

/* -------- GET all zones -------- */
router.get('/', async (req, res) => {
  try {
    const zones = await Zone.find();
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

/* -------- DELETE zone -------- */
router.delete('/:id', async (req, res) => {
  try {
    const deletedZone = await Zone.findByIdAndDelete(req.params.id);

    if (!deletedZone) {
      return res.status(404).json({ message: 'Zone not found' });
    }

    res.json({ message: 'Zone deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
