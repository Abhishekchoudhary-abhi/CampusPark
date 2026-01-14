import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    universityId: { type: String, unique: true },
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, select: false },
    role: {
      type: String,
      enum: ['OWNER', 'ADMIN', 'TEACHER', 'STUDENT'],
      default: 'STUDENT',
    },
    otp: String,
    otpExpiry: Date,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
