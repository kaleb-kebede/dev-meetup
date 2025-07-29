import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

import { 
    getUserProfile,
    followUser,
    updateUserProfile,
    searchUsers // 1. Import the new searchUsers function
} from '../controllers/userController.js';

// --- NEW: Search Route ---
// This must come before the '/:username' route to avoid conflicts
// @route   GET api/users/search
// @desc    Search for users by username
// @access  Private
router.get('/search', protect, searchUsers);

// --- Update Profile Route ---
router.put('/profile', protect, updateUserProfile);

// --- Existing Routes ---
// Get user profile by username
router.get('/:username', getUserProfile);

// Follow or unfollow a user
router.put('/:id/follow', protect, followUser);

export default router;
