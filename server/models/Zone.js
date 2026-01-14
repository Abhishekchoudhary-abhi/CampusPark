import mongoose from 'mongoose';

const zoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    default: '',
  },

  // 🔥 Soft delete flag
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model('Zone', zoneSchema);
