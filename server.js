import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors'; // ✅ Corrected
import authRoutes from './routes/authRoutes.js'; // Ensure .js extension

dotenv.config();

const app = express();
app.use(express.json());

// ✅ CORS setup
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// ✅ Routes
app.use('/api/auth', authRoutes);

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

