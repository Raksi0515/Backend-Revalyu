
// // routes/userRoutes.js
// import express from 'express';
// import {
//   registerUser,
//   authUser,
//   getAllUsers,
//   updateUser,
//   deleteUser,
  
// } from '../controllers/userController.js';
// import { protect, admin } from '../middleware/authMiddleware.js';
// import { getUserProfile } from '../controllers/userController.js';
// import { redeemPoints } from '../controllers/userController.js';

// // import { upload } from '../middleware/upload.js';

// // import { updateUserProfile } from '../controllers/userController.js';








// const router = express.Router();

// router.post('/signup', registerUser);
// router.post('/login', authUser);
// router.get('/', protect, admin, getAllUsers);
// router.put('/:id', protect, admin, updateUser);
// router.delete('/:id', protect, admin, deleteUser);
// router.get('/profile', protect, getUserProfile);

// router.post('/redeem', protect, redeemPoints);

// // router.put('/profile', protect, upload.single('profilePhoto'), updateUserProfile);


// export default router;

// routes/userRoutes.js
import express from 'express';
import {
  registerUser,
  authUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserProfile,
  redeemPoints,
  updateUserProfile,
    getMyProfile 

} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/multer.js';  // Import multer for Cloudinary upload
import uploadAvatar from '../middleware/uploadAvatar.js';

const router = express.Router();

// Public routes
router.post('/signup', registerUser);
router.post('/login', authUser);

// Admin routes
router.get('/', protect, admin, getAllUsers);
router.put('/:id', protect, admin, updateUser);
router.delete('/:id', protect, admin, deleteUser);

// User routes
router.get('/profile', protect, getUserProfile);
// router.put('/me', protect, upload.single('avatar'), updateUserProfile);  // Profile update with avatar upload
router.put('/me', protect, upload.single('avatar'), updateUserProfile);

router.post('/redeem', protect, redeemPoints);

router.get('/me', protect, getMyProfile);

router.put('/profile', protect, uploadAvatar.single('avatar'), updateUserProfile);


export default router;
