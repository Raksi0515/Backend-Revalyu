// models/Donation.js
import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  quantity: { type: Number, required: true },
  pickupAddress: { type: String, required: true },
  status: { type: String, enum: ['pending', 'picked'], default: 'pending' },
  date: { type: Date, default: Date.now },
  pointsEarned: { type: Number, default: 0 }
});

const Donation = mongoose.model('Donation', donationSchema);
export default Donation;
