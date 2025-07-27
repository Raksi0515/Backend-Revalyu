// // middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';


export const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authorized' });

  try {
    const decoded = jwt.verify(token, 'secretkey');
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token failed' });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') next();
  else res.status(403).json({ message: 'Admin only' });
};

// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';

// // Middleware to protect routes - verifies token and attaches user to request
// export const protect = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ message: 'Not authorized, no token' });
//     }

//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, 'secretkey');

//     // Find user by decoded id, exclude password field
//     const user = await User.findById(decoded.id).select('-password');

//     if (!user) {
//       return res.status(401).json({ message: 'Not authorized, user not found' });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     console.error('Auth middleware error:', error);
//     return res.status(401).json({ message: 'Token failed or invalid' });
//   }
// };

// // Middleware to allow only admin users to access route
// export const admin = (req, res, next) => {
//   console.log('Checking admin access for user:', req.user);

//   if (req.user && req.user.role && req.user.role.toLowerCase() === 'admin') {
//     return next();
//   } else {
//     console.log('Access denied: User role:', req.user?.role);
//     return res.status(403).json({ message: 'Admin only' });
//   }
// };
