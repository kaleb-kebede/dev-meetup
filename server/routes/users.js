import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

import { 
    getAllUsers,
    getUserProfile,
    followUser,
    updateUserProfile,
    searchUsers,
    updateProfilePicture // 1. Import the new function
} from '../controllers/userController.js';

// Get all users for suggestions
router.get('/', protect, getAllUsers);

// --- NEW: Update Profile Picture Route ---
// @route   PUT api/users/profile/picture
// @desc    Update user profile picture URL
// @access  Private
router.put('/profile/picture', protect, updateProfilePicture);


// --- Existing Routes ---
router.get('/search', protect, searchUsers);
router.put('/profile', protect, updateUserProfile);
router.get('/:username', getUserProfile);
router.put('/:id/follow', protect, followUser);

export default router;
