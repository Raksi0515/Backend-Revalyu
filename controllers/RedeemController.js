import asyncHandler from 'express-async-handler';
import Redeem from '../models/Redeem.js';

// User Redeem request create
export const createRedeemRequest = asyncHandler(async (req, res) => {
  const user = req.user;

  if (user.totalPoints < 3000) {
    return res.status(400).json({ message: 'You need at least 3000 points to redeem.' });
  }

  // Create redeem request with status "pending"
  const redeemAmount = user.totalPoints * 1;

  const redeem = await Redeem.create({
    user: user._id,
    pointsRedeemed: user.totalPoints,
    amountGiven: redeemAmount,
    status: 'pending',
  });

  // Reset user points (or you may want to deduct points only after approval)
  user.totalPoints = 0;
  await user.save();

  res.status(201).json({ message: 'Redeem request created', redeem });
});

// Admin: Get all redeem requests
export const getAllRedeemRequests = asyncHandler(async (req, res) => {
  const redeems = await Redeem.find()
    .populate('user', 'name email')
    .sort({ date: -1 });

  res.json(redeems);
});

// Admin: Approve redeem request (mark as paid)
export const approveRedeemRequest = asyncHandler(async (req, res) => {
  const redeem = await Redeem.findById(req.params.id);
  if (!redeem) {
    res.status(404);
    throw new Error('Redeem request not found');
  }

  if (redeem.status === 'paid') {
    return res.status(400).json({ message: 'Already paid' });
  }

  redeem.status = 'paid';
  await redeem.save();

  res.json({ message: 'Redeem request approved and marked as paid' });
});
