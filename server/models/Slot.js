import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: true,
      trim: true,
    },

    zone: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Zone',
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ['AVAILABLE', 'RESERVED', 'OCCUPIED', 'MAINTENANCE'],
      default: 'AVAILABLE',
    },

    updatedAt: {
      type: String, // ⚠️ kept as-is to avoid breaking existing logic
    },

    // 🔥 Soft delete flag
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

export default mongoose.model('Slot', slotSchema);
