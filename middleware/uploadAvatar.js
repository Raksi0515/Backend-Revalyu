import multer from 'multer';
import path from 'path';

// Storage config (local upload example)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/avatars'); // Folder create பண்ணிக்குறீங்களா சரி
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // unique file name
  }
});

// File filter for image only
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG and PNG files allowed!'), false);
  }
};

const uploadAvatar = multer({ storage, fileFilter });

export default uploadAvatar;
