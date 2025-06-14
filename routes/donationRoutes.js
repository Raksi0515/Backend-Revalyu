// routes/donationRoutes.js
import express from 'express';
import {
  submitDonation,
  getMyDonations,
  getAllDonations
} from '../controllers/donationController.js';

import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, submitDonation);       // POST /api/donations
router.get('/my', protect, getMyDonations);      // GET /api/donations/my
router.get('/', protect, admin, getAllDonations);// GET /api/donations

export default router;
