// routes/donationRoutes.js
import express from 'express';
import {

  getMyDonations,
  getAllDonations,
  verifyDonation
} from '../controllers/donationController.js';
import { submitDonation } from '../controllers/donationController.js';


import { protect, admin } from '../middleware/authMiddleware.js';
import { markPickup } from '../controllers/donationController.js';

const router = express.Router();

router.post('/', protect, submitDonation);       // POST /api/donations
router.get('/my', protect, getMyDonations);      // GET /api/donations/my
router.get('/', protect, admin, getAllDonations);// GET /api/donations
router.patch('/:id/verify', protect, admin, verifyDonation); // Admin verifies
router.patch('/:id/pickup', protect, admin, markPickup);


export default router;
