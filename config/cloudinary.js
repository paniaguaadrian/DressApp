const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

var topStorage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'top-items', // The name of the folder in cloudinary
  allowedFormats: ['jpg', 'png'],
  filename: function (req, file, cb) {
    cb(null, file.originalname.split('.')[0]); // The file on cloudinary would have the same name as the original file name
  }
});

const topCloud = multer({ storage: topStorage});

module.exports = topCloud;
