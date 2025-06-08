
// import express from 'express';
// import { registerUser, loginUser } from '../controllers/authController.js';

// const router = express.Router();

// router.post('/register', registerUser);
// router.post('/login',(req,res) =>{ const{ email, password } = req.body;res.send("Login successful");});

// export default router;


import express from 'express';
import { getAllUsers } from '../controllers/authController.js';
import { updateUser } from '../controllers/authController.js';
import { deleteUser } from '../controllers/authController.js';


const router = express.Router();

// User authentication routes
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;
