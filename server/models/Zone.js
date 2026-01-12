import mongoose from 'mongoose';

const zoneSchema = new mongoose.Schema({
  name: String,
  description: String
});

export default mongoose.model('Zone', zoneSchema);
