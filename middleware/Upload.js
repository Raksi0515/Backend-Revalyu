// import multer from 'multer';
// import path from 'path';

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });

// const fileFilter = (req, file, cb) => {
//   if(['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype)){
//     cb(null, true);
//   } else {
//     cb(new Error('Only images allowed'), false);
//   }
// };

// export const upload = multer({ storage, fileFilter });
