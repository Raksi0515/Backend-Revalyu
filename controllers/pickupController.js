import asyncHandler from 'express-async-handler';
import PickupRequest from '../models/PickupRequest.js';
import User from '../models/User.js';

/**
 * @desc    User requests a pickup
 * @route   POST /api/pickup/request
 * @access  Private (User)
 */
export const requestPickup = asyncHandler(async (req, res) => {
  const { address, bottleCount } = req.body;

  const request = await PickupRequest.create({
    user: req.user._id,
    address,
    bottleCount,
    status: 'Pending',
  });

  res.status(201).json(request);
});

/**
 * @desc    Admin assigns pickup
 * @route   PUT /api/pickup/assign/:requestId
 * @access  Private (Admin)
 */
export const assignPickup = asyncHandler(async (req, res) => {
  const { deliveryStaffId } = req.body;

  const request = await PickupRequest.findById(req.params.requestId);

  if (!request) {
    res.status(404);
    throw new Error('Pickup request not found');
  }

  request.assignedTo = deliveryStaffId;
  request.status = 'Assigned';
  await request.save();

  res.json({ message: 'Pickup assigned successfully' });
});

/**
 * @desc    View all pickup requests
 * @route   GET /api/pickup/requests
 * @access  Private (Admin/User)
 */
export const getAllPickupRequests = asyncHandler(async (req, res) => {
  let requests;

  if (req.user.role === 'admin') {
    requests = await PickupRequest.find().populate('user', 'name email');
  } else {
    requests = await PickupRequest.find({ user: req.user._id });
  }

  res.json(requests);
});


// Pickup complete & add points
export const markPickupComplete = asyncHandler(async (req, res) => {
  const request = await PickupRequest.findById(req.params.requestId);

  if (!request) {
    res.status(404);
    throw new Error('Pickup request not found');
  }

  // Update pickup status
  request.status = 'Completed';
  await request.save();

  // Add points to user
  const user = await User.findById(request.user);

  if (user) {
    const pointsPerBottle = 10; // Customize points per bottle here
    user.points += request.bottleCount * pointsPerBottle;
    await user.save();
  }

  res.json({ message: 'Pickup marked completed and points updated' });
});

