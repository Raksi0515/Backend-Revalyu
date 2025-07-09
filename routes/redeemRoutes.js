import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Redeem from '../models/Redeem.js';

const router = express.Router();

router.get('/my', protect, async (req, res) => {
  try {
    const redeems = await Redeem.find({ user: req.user._id }).sort({ date: -1 });
    res.json(redeems);
  } catch (error) {
    res.status(500).json({ message: "Failed to get redeem history" });
  }
});

export default router;
