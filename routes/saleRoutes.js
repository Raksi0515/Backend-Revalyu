// routes/saleRoutes.js
import express from 'express';
import {
  createSale,
  getAllSales,
  getSalesSummary
} from '../controllers/saleController.js';

import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, admin, createSale);
router.get('/', protect, admin, getAllSales);
router.get('/summary', protect, admin, getSalesSummary);

export default router;
