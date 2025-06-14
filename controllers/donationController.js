// controllers/donationController.js
import asyncHandler from 'express-async-handler';
import Donation from '../models/Donation.js';
import User from '../models/User.js';

// @desc User submits donation
// @route POST /api/donations
// @access Private (user)
export const submitDonation = asyncHandler(async (req, res) => {
  const { quantity, pickupAddress } = req.body;
  const user = req.user;

  const pointsEarned = quantity * 10;

  const donation = await Donation.create({
    user: user._id,
    quantity,
    pickupAddress,
    pointsEarned
  });

  // Add points to user
  user.totalPoints += pointsEarned;
  await user.save();

  res.status(201).json({ message: 'Donation submitted', donation });
});

// @desc Get user’s own donations
// @route GET /api/donations/my
// @access Private
export const getMyDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find({ user: req.user._id });
  res.json(donations);
});

// @desc Admin get all donations
// @route GET /api/donations
// @access Private/Admin
export const getAllDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find().populate('user', 'name email');
  res.json(donations);
});
