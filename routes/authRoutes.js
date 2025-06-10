
import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { getAllUsers } from '../controllers/authController.js';
import { updateUser } from '../controllers/authController.js';
import { deleteUser } from '../controllers/authController.js';
// import { getUserById } from '../controllers/userController.js';
// import { protect } from '../middleware/authMiddleware.js';



const router = express.Router();

router.post('/register', registerUser);
router.post('/login',(req,res) =>{ const{ email, password } = req.body;res.send("Login successful");});

// User authentication routes
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// router.get('/:id', protect, getUserById);

export default router;
