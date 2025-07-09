import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  quantity: { type: Number, required: true },
  pickupAddress: { type: String, required: true },
  contactNumber: { type: String, required: true },   // <-- Add this line
  status: { type: String, enum: ['pending', 'picked'], default: 'pending' },
  pointsEarned: { type: Number, default: 0 },
  donationMethod: {
    type: String,
    enum: ['scan', 'manual'],
    default: 'manual'
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });

const Donation = mongoose.model('Donation', donationSchema);
export default Donation;
