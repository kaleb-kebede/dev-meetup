import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

import { 
    createPost, 
    getAllPosts,
    likePost,
    addComment,
    getCommentsForPost,
    getFollowingFeed,
    deletePost // 1. Import the new deletePost function
} from '../controllers/postController.js';

// --- Personalized Feed Route ---
router.get('/feed', protect, getFollowingFeed);


// --- Post Routes ---
router.route('/')
  .post(protect, createPost)
  .get(getAllPosts);

// --- Like, Comment, and Delete Routes for a specific post ---
router.route('/:id')
  .delete(protect, deletePost) // 2. Add the DELETE route
  .put(protect, likePost);     // Refactored likePost to use /:id

// --- Comment Routes ---
router.route('/:postId/comments')
  .post(protect, addComment)
  .get(getCommentsForPost);

export default router;
