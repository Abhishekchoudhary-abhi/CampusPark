import express from 'express';
import Slot from '../models/Slot.js';

const router = express.Router();

/* -------- GET all slots -------- */
router.get('/', async (req, res) => {
  try {
    const slots = await Slot.find();
    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* -------- CREATE slot -------- */
router.post('/', async (req, res) => {
  try {
    const slot = new Slot(req.body);
    await slot.save();
    res.status(201).json(slot);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* -------- UPDATE slot -------- */
router.put('/:id', async (req, res) => {
  try {
    const updatedSlot = await Slot.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedSlot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    res.json(updatedSlot);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* -------- DELETE slot -------- */
router.delete('/:id', async (req, res) => {
  try {
    const deletedSlot = await Slot.findByIdAndDelete(req.params.id);

    if (!deletedSlot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    res.json({ message: 'Slot deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
