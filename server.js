import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import saleRoutes from './routes/saleRoutes.js';
import redeemRoutes from './routes/redeemRoutes.js';
// import paymentRoutes from './routes/paymentRoutes.js';
// import bottleSupplyRoutes from './routes/bottleSupplyRoutes.js';
// const bottleSupplyRoutes = require('./routes/bottleSupplyRoutes');
// import bottleSupplyRoutes from './routes/bottleSupplyRoutes.js'; // ✅

dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // frontend URL
  credentials: true,
}));
app.use(express.json());

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/sales', saleRoutes);
// app.use('/api/payments', paymentRoutes);
app.use('/api/redeems', redeemRoutes);
// app.use('/api/payments', paymentRoutes);
app.use('/uploads', express.static('uploads'));





// app.use('/api/bottles', bottleSupplyRoutes); // ✅


// Start server after DB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error(' DB connection failed:', err));
