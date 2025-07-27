// // Install needed packages:
// // npm install express multer cloudinary dotenv

// const express = require('express');
// const multer = require('multer');
// const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// require('dotenv').config();

// const app = express();

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Configure multer-storage-cloudinary
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'plastic-bottle-app', // folder name in Cloudinary
//     allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
//   },
// });

// const upload = multer({ storage });

// app.post('/api/upload', upload.single('file'), (req, res) => {
//   try {
//     // req.file.path contains the uploaded image URL on Cloudinary
//     res.json({ imageUrl: req.file.path });
//   } catch (error) {
//     res.status(500).json({ error: 'Upload failed' });
//   }
// });

// app.listen(5000, () => {
//   console.log('Server running on port 5000');
// });


// import multer from 'multer';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// import cloudinary from '../utils/cloudinary.js';

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'profile_avatars',
//     allowed_formats: ['jpg', 'png', 'jpeg'],
//     transformation: [{ width: 300, height: 300, crop: 'limit' }],
//   },
// });

//  export const upload = multer({ storage });

// export default upload;

