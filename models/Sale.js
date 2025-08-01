// models/Sale.js
import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  quantitySold: { type: Number, required: true },
  amountReceived: { type: Number, required: true },
  saleDate: { type: Date, default: Date.now },
   status: {type: String,enum: ['pending', 'picked'],default: 'pending',}
});

const Sale = mongoose.model('Sale', saleSchema);
export default Sale;
