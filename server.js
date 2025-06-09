import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/authRoutes.js';
import bottleRoutes from './routes/bottleRoutes.js';
import mongoose from 'mongoose';
import cors from 'cors'; // ✅ Corrected
// import pickupRoutes from './routes/pickupRoutes.js';



dotenv.config();
const app = express();

app.use(express.json());
connectDB();
app.use('/api', userRoutes);
app.use('/api/auth', authRoutes);

// ✅ CORS setup
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));


// ✅ MongoDB Connect and Start Server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
  );
})
.catch((err) => console.error('DB connection failed:', err));




// user authentication routes
app.use('/api', authRoutes);

// Bottle management routes
app.use('/api/bottles', bottleRoutes);
// app.use('/api/pickup', pickupRoutes);


// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server ${PORT} started`));
