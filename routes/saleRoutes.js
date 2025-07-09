// // routes/saleRoutes.js
// import express from 'express';
// import {
//   createSale,
//   getAllSales,
//   getSalesSummary
// } from '../controllers/saleController.js';

// // import { protect, admin } from '../middleware/authMiddleware.js';
// import { protect, admin } from '../middleware/authMiddleware.js';


// const router = express.Router();

// router.get('/', protect, admin, getAllSales);
// router.get('/summary', protect, admin, getSalesSummary);

// router.post('/', protect, admin, createSale);

// export default router;

import express from 'express';
import {
  createSale,
  getAllSales,
  getSalesSummary,
  
 } from '../controllers/saleController.js';
 import { updateSaleStatus } from '../controllers/saleController.js';



import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, admin, createSale);
router.get('/', protect, admin, getAllSales);
router.get('/summary', protect, admin, getSalesSummary);

router.patch('/:id', protect, admin, updateSaleStatus);




export default router;
