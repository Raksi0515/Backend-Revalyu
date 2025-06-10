import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import PickupRequest from '../models/PickupRequest.js';

export const getAdminDashboard = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalRequests = await PickupRequest.countDocuments();
  const completedPickups = await PickupRequest.countDocuments({ status: 'Completed' });
  const pendingPickups = await PickupRequest.countDocuments({ status: { $in: ['Pending', 'Assigned'] } });

  const allUsers = await User.find();
  const totalBottlePoints = allUsers.reduce((sum, user) => sum + (user.bottlePoints || 0), 0);

  res.json({
    totalUsers,
    totalRequests,
    completedPickups,
    pendingPickups,
    totalBottlePoints,
  });
});
