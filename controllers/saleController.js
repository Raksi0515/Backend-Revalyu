//  import asyncHandler from 'express-async-handler';
//  import Sale from '../models/Sale.js';
//  import sendEmail from '../models/sendEmail.js'; // ✅ Correct path

// // @desc Add a new bottle sale (admin only)
// // @route POST /api/sales
// // @access Private/Admin
// const validateEmail = (email) => {
//   return /\S+@\S+\.\S+/.test(email);
// };

// export const createSale = asyncHandler(async (req, res) => {
//   const { companyName, quantitySold, adminEmail } = req.body;

//   // Validation
//   if (!companyName || !quantitySold) {
//     res.status(400);
//     throw new Error('All fields are required');
//   }

//   if (adminEmail && !validateEmail(adminEmail)) {
//     res.status(400);
//     throw new Error('Invalid adminEmail');
//   }
//   const amountReceived = quantitySold * 10;

//   // Create sale
//   const sale = await Sale.create({
//     companyName,
//     quantitySold,
//     amountReceived
//   });

//   // Send Email Notification (optional)
//   if (adminEmail) {
//     try {
//       await sendEmail({
//         to: adminEmail,
//         subject: 'REVALYU New Bottle Sale Recorded',
//         text: `📦 Thank you for choosing REVALYU, Sale successfully added:\n
// Company Name: ${companyName}
// Bottles Count: ${quantitySold}
// Total Amount: Rs. ${amountReceived}
// Date: ${new Date().toLocaleDateString()} :\n
// If you need any further information , please conact us - 0771234567`

//       });
      
//     } catch (err) {
//       console.error('Email sending failed:', err.message);
//       // Optional: you might still want to send response even if email fails
//     }
//   }

//   // Send response after everything
//   res.status(201).json({ message: 'Sale recorded and email sent', sale });
// });


// // @desc Get all sales
// // @route GET /api/sales
// // @access Private/Admin
// export const getAllSales = asyncHandler(async (req, res) => {
//   const sales = await Sale.find().sort({ saleDate: -1 });
//   res.json(sales);
// });

// // @desc Get total sales summary
// // @route GET /api/sales/summary
// // @access Private/Admin
// export const getSalesSummary = asyncHandler(async (req, res) => {
//   const sales = await Sale.find();
//   const totalQuantity = sales.reduce((sum, s) => sum + s.quantitySold, 0);
//   const totalRevenue = sales.reduce((sum, s) => sum + s.amountReceived, 0);

//   res.json({ totalQuantity, totalRevenue });
//   });


// // @desc Update sale status (admin only)
// // @route PATCH /api/sales/:id
// // @access Private/Admin
// export const updateSaleStatus = asyncHandler(async (req, res) => {
//   const saleId = req.params.id;
//   const { status } = req.body;

//   if (!['pending', 'picked'].includes(status)) {
//     res.status(400);
//     throw new Error('Invalid status value');
//   }

//   const sale = await Sale.findById(saleId);
//   if (!sale) {
//     res.status(404);
//     throw new Error('Sale not found');
//   }

//   sale.status = status;
//   await sale.save();

//   res.json({ message: 'Status updated', sale });
// });


import asyncHandler from 'express-async-handler';
import Sale from '../models/Sale.js';
import sendEmail from '../models/sendEmail.js'; // ✅ Correct path

// ✅ Email Validator
const validateEmail = (email) => {
  return /\S+@\S+\.\S+/.test(email);
};

// @desc Add a new bottle sale (admin only)
// @route POST /api/sales
// @access Private/Admin
export const createSale = asyncHandler(async (req, res) => {
  const { companyName, quantitySold, adminEmail } = req.body;

  // Validation
  if (!companyName || !quantitySold) {
    res.status(400);
    throw new Error('All fields are required');
  }

  if (adminEmail && !validateEmail(adminEmail)) {
    res.status(400);
    throw new Error('Invalid adminEmail');
  }

  const amountReceived = quantitySold * 10;

  // Create new sale (status: 'pending' by default)
  const sale = await Sale.create({
    companyName,
    quantitySold,
    amountReceived,
  });

  // ✅ Get total picked bottle quantity so far
  const pickedSales = await Sale.find({ status: 'picked' });
  const totalPickedBottles = pickedSales.reduce(
    (sum, s) => sum + s.quantitySold,
    0
  );

  // Send Email Notification (optional)
  if (adminEmail) {
    try {
      await sendEmail({
        to: adminEmail,
        subject: 'REVALYU New Bottle Sale Recorded',
        text: ` Thank you for choosing REVALYU, a new sale has been recorded:\n
Company Name: ${companyName}
Bottles Count (This Sale): ${quantitySold}
Date: ${new Date().toLocaleDateString()}

 Total Bottles Picked So Far: ${totalPickedBottles}

If you need any further information, please contact us - 0771234567`,
      });
    } catch (err) {
      console.error('Email sending failed:', err.message);
      // Optional: still allow sale to be recorded
    }
  }

  // Final response
  res.status(201).json({ message: 'Sale recorded and email sent', sale });
});

// @desc Get all sales
// @route GET /api/sales
// @access Private/Admin
export const getAllSales = asyncHandler(async (req, res) => {
  const sales = await Sale.find().sort({ saleDate: -1 });
  res.json(sales);
});

// @desc Get total sales summary
// @route GET /api/sales/summary
// @access Private/Admin
export const getSalesSummary = asyncHandler(async (req, res) => {
  const sales = await Sale.find();
  const totalQuantity = sales.reduce((sum, s) => sum + s.quantitySold, 0);
  const totalRevenue = sales.reduce((sum, s) => sum + s.amountReceived, 0);

  res.json({ totalQuantity, totalRevenue });
});

// @desc Update sale status (admin only)
// @route PATCH /api/sales/:id
// @access Private/Admin
export const updateSaleStatus = asyncHandler(async (req, res) => {
  const saleId = req.params.id;
  const { status } = req.body;

  if (!['pending', 'picked'].includes(status)) {
    res.status(400);
    throw new Error('Invalid status value');
  }

  const sale = await Sale.findById(saleId);
  if (!sale) {
    res.status(404);
    throw new Error('Sale not found');
  }

  // Prevent double-picking
  if (sale.status === 'picked' && status === 'picked') {
    res.status(400);
    throw new Error('Sale already marked as picked');
  }

  // Update status
  sale.status = status;
  await sale.save();

  res.json({ message: 'Status updated successfully', sale });
});


