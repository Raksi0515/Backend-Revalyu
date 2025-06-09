
 

import jwt from 'jsonwebtoken';
import User from '../models/User.js';


const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET, // This must not be undefined
    { expiresIn: '1d' }
  );
};

export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const user = await User.create({ name, email, password, role });

  res.status(201).json({
    message: 'User registered successfully',
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user),
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user),
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};







// import User from '../models/User.js';


// // ✅ Register User
// const registerUser = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // Validation
//     if (!name || !email || !password) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }

//     // Existing user check
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(409).json({ message: 'User already exists' });
//     }

//     // Create and save new user
//     const newUser = new User({ name, email, password });
//     await newUser.save();

//     res.status(201).json({ message: 'User registered successfully', user: newUser });
//   } catch (err) {
//     res.status(500).json({ message: 'Registration failed', error: err.message });
//   }
// };


// // ✅ Login User
// const loginUser = async (req, res) => {
//   try {
//     // login logic here (future logic like JWT to be added)
//     res.status(200).json({ message: "Login successful" });
//   } catch (error) {
//     res.status(500).json({ message: "Login failed", error: error.message });
//   }
// };




// ✅ Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude password field
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: ' Failed to fetch users' });
  }
};


// // ✅ Update User
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params; // Get user ID from request parameters
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'User not updated', error: error.message });
  }
};


// Delete a user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'User deletion failed', error: error.message });
  }
};


