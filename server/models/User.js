import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    // Optional university identifier
    // ✔ Unique when present
    // ✔ Allows multiple null values
    universityId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    // Basic identity
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Password is excluded by default in queries
    password: {
      type: String,
      required: true,
      select: false,
    },

    /**
     * ROLE RULES
     * - STUDENT / TEACHER → self-register
     * - ADMIN            → created by OWNER
     * - OWNER            → seeded manually
     */
    role: {
      type: String,
      enum: ['OWNER', 'ADMIN', 'TEACHER', 'STUDENT'],
      default: 'STUDENT',
    },

    // OTP for forgot-password / verification
    otp: {
      type: String,
      select: false,
    },

    otpExpiry: {
      type: Date,
      select: false,
    },

    // Account control
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

/* ==================== INDEXES ==================== */

// Case-insensitive unique email enforcement
userSchema.index({ email: 1 }, { unique: true });

// universityId index is handled via `unique + sparse` in schema

export default mongoose.model('User', userSchema);
