import express from 'express';
import multer from 'multer';
import path from 'path';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- Multer Storage Configuration ---
const storage = multer.diskStorage({
  // Set the destination for uploaded files
  destination(req, file, cb) {
    cb(null, 'uploads/'); // Save files to the 'uploads' folder
  },
  // Set the filename for uploaded files
  filename(req, file, cb) {
    // Create a unique filename to prevent overwriting
    // It will be: fieldname-timestamp.extension (e.g., image-1678886400000.jpg)
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// --- Multer Upload Middleware ---
// Initialize multer with our storage configuration
const upload = multer({
  storage,
  // Optional: Add file type validation here
});

// @route   POST /api/upload
// @desc    Upload an image file
// @access  Private
router.post('/', protect, upload.single('image'), (req, res) => {
  // 'upload.single('image')' processes a single file from a form field named 'image'.
  // If the upload is successful, the file's information is available in req.file.

  // We send back the path to the uploaded file.
  // The path will be something like: \uploads\image-1678886400000.jpg
  // We replace the backslash with a forward slash for web compatibility.
  res.send({
    message: 'Image Uploaded',
    image: `/${req.file.path.replace(/\\/g, "/")}`,
  });
});

export default router;
