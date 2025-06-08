import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/authRoutes.js';



dotenv.config();
const app = express();

app.use(express.json());
connectDB();
app.use('/api', userRoutes);


// user authentication routes
app.use('/api', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server ${PORT} started`));
