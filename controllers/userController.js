// controllers/userController.js
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Redeem from '../models/Redeem.js'; 

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

    // Redeem history சேர்க்கும் code
    await Redeem.create({
      user: user._id,
      pointsRedeemed: user.totalPoints,
      amountGiven: redeemAmount,
    });

    // Redeem ஆனபின் point reset பண்ணுங்க
    user.totalPoints = 0;

    // Redeem amount user.moneyEarned-க்கு சேர்க்கலாம் (அல்லது பணம் userக்கு கிடைத்துவிட்டதாக track பண்ண)
    user.moneyEarned = user.moneyEarned ? user.moneyEarned + redeemAmount : redeemAmount;

    await user.save();

    res.status(200).json({
      success: true,
      message: `Successfully redeemed ${redeemAmount.toLocaleString('en-LK', { style: 'currency', currency: 'LKR' })}`,
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

// export const updateUserProfile = async (req, res) => {
//   const user = await User.findById(req.user._id);

//   if (user) {
//     user.name = req.body.name || user.name;
//     user.email = req.body.email || user.email;

//     if (req.file) {
//       user.profilePhoto = req.file.filename; // store filename only
//     }

//     const updatedUser = await user.save();
//     res.status(200).json({
//       _id: updatedUser._id,
//       name: updatedUser.name,
//       email: updatedUser.email,
//       profilePhoto: updatedUser.profilePhoto,
//     });
//   } else {
//     res.status(404).json({ message: 'User not found' });
//   }
// };

