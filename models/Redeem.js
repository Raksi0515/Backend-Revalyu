import mongoose from 'mongoose';

const redeemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pointsRedeemed: { type: Number, required: true },
  amountGiven: { type: Number, required: true },
   status: { type: String, enum: ['pending', 'paid'], default: 'pending' },  // you can keep or remove this
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date },
  date: { type: Date, default: Date.now }
});

export default mongoose.model('Redeem', redeemSchema);
