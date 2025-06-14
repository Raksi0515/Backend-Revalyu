// controllers/saleController.js
import asyncHandler from 'express-async-handler';
import Sale from '../models/Sale.js';

// @desc Add a new bottle sale (admin only)
// @route POST /api/sales
// @access Private/Admin
export const createSale = asyncHandler(async (req, res) => {
  const { companyName, quantitySold, amountReceived } = req.body;

  if (!companyName || !quantitySold || !amountReceived) {
    res.status(400);
    throw new Error('All fields are required');
  }

  const sale = await Sale.create({ companyName, quantitySold, amountReceived });

  res.status(201).json({ message: 'Sale recorded', sale });
});

// @desc Get all sales
// @route GET /api/sales
// @access Private/Admin
export const getAllSales = asyncHandler(async (req, res) => {
  const sales = await Sale.find().sort({ saleDate: -1 });
  res.json(sales);
});

// @desc Get summary: total bottles sold + total amount received
// @route GET /api/sales/summary
// @access Private/Admin
export const getSalesSummary = asyncHandler(async (req, res) => {
  const sales = await Sale.find();
  const totalQuantity = sales.reduce((sum, s) => sum + s.quantitySold, 0);
  const totalRevenue = sales.reduce((sum, s) => sum + s.amountReceived, 0);

  res.json({ totalQuantity, totalRevenue });
});
