import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema({
  number: String,
  zone: String,
  status: String,
  updatedAt: String
});

export default mongoose.model('Slot', slotSchema);
