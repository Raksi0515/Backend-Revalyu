import express from 'express';
import {
  requestPickup,
  assignPickup,
  getAllPickupRequests,
  markPickupComplete,
} from '../controllers/pickupController.js';
// import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { protect, admin } from '../middleware/authMiddleware.js';

import * as pickupController from '../controllers/pickupController.js';




const router = express.Router();

// User requests pickup
router.post('/request', requestPickup);

// Admin assigns pickup request
router.put('/assign/:requestId', assignPickup); // ✅ Correct handler


// View all pickup requests (user/admin filtered in controller)
router.get('/requests', getAllPickupRequests);


// Admin marks pickup as completed
router.put('/complete/:requestId', protect, admin, markPickupComplete);



export default router;
