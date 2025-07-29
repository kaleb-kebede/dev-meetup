import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

import { 
    createPost, 
    getAllPosts,
    likePost,
    addComment,
    getCommentsForPost,
    getFollowingFeed // 1. Import the new feed function
} from '../controllers/postController.js';

// --- Personalized Feed Route ---
// 2. Add the new route for the personalized feed
// This must come before the '/:id' routes to avoid conflicts
router.get('/feed', protect, getFollowingFeed);


// --- Post Routes ---
router.route('/')
  .post(protect, createPost)
  .get(getAllPosts);

// --- Like Route ---
router.route('/:id/like')
  .put(protect, likePost);

// --- Comment Routes ---
router.route('/:postId/comments')
  .post(protect, addComment)
  .get(getCommentsForPost);

export default router;
