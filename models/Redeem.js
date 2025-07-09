import mongoose from 'mongoose';

const redeemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pointsRedeemed: { type: Number, required: true },
  amountGiven: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.model('Redeem', redeemSchema);
