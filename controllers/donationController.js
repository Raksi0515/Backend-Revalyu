// // controllers/donationController.js
// import asyncHandler from 'express-async-handler';
// import Donation from '../models/Donation.js';
// import User from '../models/User.js';

// // @desc User submits donation
// // @route POST /api/donations
// // @access Private (user)
// export const submitDonation = asyncHandler(async (req, res) => {
//   const { quantity, pickupAddress } = req.body;
//   const user = req.user;

//   const pointsEarned = quantity * 10;

//   const donation = await Donation.create({
//     user: user._id,
//     quantity,
//     pickupAddress,
      
//     pointsEarned
//   });

//   // Add points to user
//   user.totalPoints += pointsEarned;
//   await user.save();

//   res.status(201).json({ message: 'Donation submitted', donation });
// });

// // @desc Get user’s own donations
// // @route GET /api/donations/my
// // @access Private
// export const getMyDonations = asyncHandler(async (req, res) => {
//   const donations = await Donation.find({ user: req.user._id })
//   .sort({ date: -1 }); 
//   res.json(donations);
// });

// // @desc Admin get all donations
// // @route GET /api/donations
// // @access Private/Admin
// export const getAllDonations = asyncHandler(async (req, res) => {
//   const donations = await Donation.find().populate('user', 'name email');
//   res.json(donations);
// });

// controllers/donationController.js

import asyncHandler from 'express-async-handler';
import Donation from '../models/Donation.js';
import User from '../models/User.js';
import sendEmail from '../models/sendEmail.js'; // ✅ Correct path


// export const submitDonation = asyncHandler(async (req, res) => {
//   const { quantity, pickupAddress, contactNumber, donationMethod, email } = req.body;
//   const user = req.user;
    
//   console.log('Received email:', email)

//   if (!contactNumber) {
//     return res.status(400).json({ message: 'Contact number is required' });
//   }

//   // Daily donation limit check
//   const start = new Date();
//   start.setHours(0, 0, 0, 0);
//   const end = new Date();
//   end.setHours(23, 59, 59, 999);

//   const todayDonations = await Donation.aggregate([
//     {
//       $match: {
//         user: user._id,
//         createdAt: { $gte: start, $lte: end }
//       }
//     },
//     {
//       $group: {
//         _id: null,
//         totalQuantity: { $sum: "$quantity" }
//       }
//     }
//   ]);

//   const donatedToday = todayDonations.length > 0 ? todayDonations[0].totalQuantity : 0;
//   const totalIfSubmitted = donatedToday + quantity;

//   if (totalIfSubmitted > 20) {
//     return res.status(400).json({
//       message: `Daily limit exceeded. Already donated ${donatedToday} bottles today.`
//     });
//   }


//   // Create donation with contactNumber included
//   const donation = await Donation.create({
//     user: user._id,
//     quantity,
//     pickupAddress,
//     contactNumber,           // <--- add contactNumber here
//     pointsEarned: 0,
//     donationMethod: donationMethod || 'manual',
//     verificationStatus: 'pending',
//     email,
//   });

//   try {
//     await sendEmail({
//       to: email, // email received from frontend form
//       subject: '🎉 Thank you for your bottle donation!',
//       text: `Dear ${user.name},\n\nThank you for donating ${quantity} bottles. Our team will reach out for pickup at:\n${pickupAddress}.\n\n- Revalyu Team`,
//       html: `<p>Dear ${user.name},</p>
//              <p>Thank you for donating <strong>${quantity}</strong> bottles.</p>
//              <p>We will reach out for pickup at:<br/>${pickupAddress}</p>
//              <p>Best regards,<br/>Revalyu Team</p>`
//     });
//   } catch (error) {
//     console.error('Email send failed:', error.message);
//   }

//   res.status(201).json({
//     message: 'Donation submitted. Confirmation email sent.',
//     donation
//   });
// });

export const submitDonation = asyncHandler(async (req, res) => {
  const {
    quantity,
    pickupAddress,
    contactNumber,
    donationMethod,
    email,
  } = req.body;

  const user = req.user;

  /* ---------- validations ---------- */
  if (!contactNumber) {
    return res.status(400).json({ message: 'Contact number is required' });
  }
  if (!quantity || quantity <= 0) {
    return res.status(400).json({ message: 'Quantity must be a positive number' });
  }

  /* ---------- ✅ no daily‑limit check ---------- */

  const donation = await Donation.create({
    user: user._id,
    quantity,
    pickupAddress,
    contactNumber,
    pointsEarned: 0,
    donationMethod: donationMethod || 'manual',
    verificationStatus: 'pending',
    email,
  });

  /* ---------- email notification ---------- */
  try {
    await sendEmail({
      to:      email,
      subject: ' Thank you for your bottle donation!',
      text:    `Dear ${user.name},\n\nThank you for donating ${quantity} bottles. Our team will reach out for pickup at:\n${pickupAddress}.\n\n- Revalyu Team`,
      html:    `<p>Dear ${user.name},</p>
                <p>Thank you for donating <strong>${quantity}</strong> bottles.</p>
                <p>We will reach out for pickup at:<br/>${pickupAddress}</p>
                <p>Best regards,<br/>Revalyu Team</p>`,
    });
  } catch (err) {
    console.error('Email send failed:', err.message);
    // continue anyway – donation already saved
  }

  return res.status(201).json({
    success: true,
    message: 'Donation submitted. Confirmation email sent.',
    donation,
  });
});


// @desc Get donations of logged-in user
// @route GET /api/donations/my
// @access Private
export const getMyDonations = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const donations = await Donation.find({ user: userId }).sort({ createdAt: -1 });
  res.json(donations);
});

// @desc Admin get all donations
// @route GET /api/donations
// @access Private/Admin
export const getAllDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.json(donations);
});

// @desc Admin verifies donation and gives points
// @route PATCH /api/donations/:id/verify
// @access Private/Admin
export const verifyDonation = asyncHandler(async (req, res) => {
  const donation = await Donation.findById(req.params.id);
  if (!donation) {
    return res.status(404).json({ message: 'Donation not found' });
  }

  if (donation.verificationStatus === 'verified') {
    return res.status(400).json({ message: 'Donation already verified' });
  }

  donation.verificationStatus = 'verified';
  donation.pointsEarned = donation.quantity * 10;
  await donation.save();

  const user = await User.findById(donation.user);
  user.totalPoints += donation.pointsEarned;
  await user.save();

  res.json({
    message: 'Donation verified and points added.',
    donation
  });
});
// @desc Mark donation as picked up
// @route PATCH /api/donations/:id/pickup
// @access Private/Admin
export const markPickup = asyncHandler(async (req, res) => {
  const donation = await Donation.findById(req.params.id);
  if (!donation) {
    return res.status(404).json({ message: 'Donation not found' });
  }

  if (donation.status === 'picked') {
    return res.status(400).json({ message: 'Donation already picked up' });
  }

  donation.status = 'picked';
  await donation.save();

  res.json({ message: 'Donation marked as picked up', donation });
});
