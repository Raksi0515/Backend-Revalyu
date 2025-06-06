// import express from 'express';
// import something from './authRoutes.js'; 


// import { signup } from '../controllers/authController.js';

// const router = express.Router();

// // Signup route
// router.post('/signup', signup);

// export default router;

import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login',(req,res) =>{ const{ email, password } = req.body;res.send("Login successful");});

export default router;

