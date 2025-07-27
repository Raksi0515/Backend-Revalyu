import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import Redeem from '../models/Redeem.js';
import User from '../models/User.js';

const router = express.Router();

// @desc User Redeem History
// @route GET /api/redeems/my
// @access Private (User)
router.get('/my', protect, async (req, res) => {
  try {
    const redeems = await Redeem.find({ user: req.user._id }).sort({ date: -1 });
    res.json(redeems);
  } catch (error) {
    res.status(500).json({ message: "Failed to get redeem history" });
  }
});

// @desc Get all redeem requests (Admin)
// @route GET /api/redeems
// @access Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const redeems = await Redeem.find()
      .populate('user', 'name email')
      .sort({ date: -1 });
    res.json(redeems);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch all redeems" });
  }
});

// @desc Approve a redeem request (mark as paid)
// @route PUT /api/redeems/:id/approve
// @access Private/Admin

router.put('/:id/approve', protect, admin, async (req, res) => {
  try {
    const redeem = await Redeem.findById(req.params.id);
    if (!redeem) {
      return res.status(404).json({ message: 'Redeem not found' });
    }

    redeem.isPaid = true;
    redeem.paidAt = new Date();
    redeem.status = 'paid'; // ✅ Add this line

    await redeem.save();

    res.json({ message: 'Redeem marked as paid', redeem });
  } catch (error) {
    res.status(500).json({ message: "Failed to approve redeem" });
  }
});

  



export default router;
