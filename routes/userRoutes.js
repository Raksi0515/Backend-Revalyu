
// routes/userRoutes.js
import express from 'express';
import {
  registerUser,
  authUser,
  getAllUsers,
  updateUser,
  deleteUser,
  
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { getUserProfile } from '../controllers/userController.js';
import { redeemPoints } from '../controllers/userController.js';

// import { upload } from '../middleware/upload.js';

// import { updateUserProfile } from '../controllers/userController.js';








const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', authUser);
router.get('/', protect, admin, getAllUsers);
router.put('/:id', protect, admin, updateUser);
router.delete('/:id', protect, admin, deleteUser);
router.get('/profile', protect, getUserProfile);

router.post('/redeem', protect, redeemPoints);

// router.put('/profile', protect, upload.single('profilePhoto'), updateUserProfile);


export default router;
