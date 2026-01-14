import mongoose from 'mongoose';

const zoneSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: '',
      trim: true,
    },

    // 🔥 Soft delete flag (used by restore API)
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true, // ✅ adds createdAt & updatedAt safely
  }
);

export default mongoose.model('Zone', zoneSchema);
