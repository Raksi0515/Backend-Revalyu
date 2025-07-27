// controllers/userController.js
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Redeem from '../models/Redeem.js';
import sendEmail from '../models/sendEmail.js'; //  Email helper 

const generateToken = (id) => jwt.sign({ id }, 'secretkey', { expiresIn: '7d' });

// @route POST /api/users/signup
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) throw new Error('User already exists');

  const user = await User.create({ name, email, password, role });
  res.status(201).json({
    _id: user._id,
    name: user.name,
    role: user.role,
    token: generateToken(user._id)
  });
});

// @route POST /api/users/login
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      role: user.role,
      token: generateToken(user._id)
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

// @route GET /api/users/ (Admin only)
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// @route PUT /api/users/:id (Admin only)
export const updateUser = asyncHandler(async (req, res) => {
  const { name, role } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) throw new Error('User not found');

  user.name = name || user.name;
  user.role = role || user.role;
  const updatedUser = await user.save();
  res.json({ message: 'User updated', user: updatedUser });
});

// @route DELETE /api/users/:id (Admin only)
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new Error('User not found');

  await user.deleteOne();
  res.json({ message: 'User deleted' });
});

// @desc Get user profile with money earned
// @route GET /api/users/profile
// @access Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const moneyEarned = user.totalPoints / 10;

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    totalPoints: user.totalPoints,
    moneyEarned: moneyEarned.toFixed(2)
  });
});

// @desc User Redeem Points
// @route POST /api/users/redeem
// @access Private
export const redeemPoints = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.totalPoints < 3000) {
      return res.status(400).json({
        success: false,
        message: "You need at least 3000 points to redeem.",
      });
    }

    const redeemAmount = user.totalPoints * 1; // 1 point = 1 LKR

    // Add to redeem history
    await Redeem.create({
      user: user._id,
      pointsRedeemed: user.totalPoints,
      amountGiven: redeemAmount,
    });

    // Reset user points
    user.totalPoints = 0;
    user.moneyEarned = user.moneyEarned ? user.moneyEarned + redeemAmount : redeemAmount;

    await user.save();

    // ✅ Send email to user after redeem
    try {
      await sendEmail({
        to: user.email,
        subject: ' Points Redeemed Successfully!',
        text: `Hi ${user.name},\n\nYou have successfully redeemed  Thank you for recycling!`,
        html: `<p>Hi ${user.name},</p><p>You have successfully redeemed </p><p>Thank you for recycling with Revalyu </p>`
      });
    } catch (emailErr) {
      console.error(' Email sending failed:', emailErr.message);
      // Don't block redeem process if email fails
    }

    res.status(200).json({
      success: true,
      message: `Successfully redeemed `,
      amount: redeemAmount,
      totalPoints: user.totalPoints,
      moneyEarned: user.moneyEarned,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error redeeming points",
      error: error.message,
    });
  }
};

// Get logged-in user's profile
export const getMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json(user);
});

// controllers/userController.js

export const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;  // ✅ Correct way to get the logged-in user

  const { name, email } = req.body;

  const updateData = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;

  if (req.file) {
    updateData.avatar = req.file.path; // ✅ If using multer+cloudinary
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
  });

  if (!updatedUser) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json(updatedUser);
});
