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
    deletePost,
    updatePost // 1. Import the new updatePost function
} from '../controllers/postController.js';

// --- Personalized Feed Route ---
router.get('/feed', protect, getFollowingFeed);


// --- Post Routes ---
router.route('/')
  .post(protect, createPost)
  .get(getAllPosts);

// --- Like, Comment, Delete, and EDIT Routes for a specific post ---
router.route('/:id')
  .delete(protect, deletePost)
  .put(protect, updatePost) // 2. Add the PUT route for editing
  .patch(protect, likePost); // Changed like to PATCH for semantic correctness

// --- Comment Routes ---
router.route('/:postId/comments')
  .post(protect, addComment)
  .get(getCommentsForPost);

export default router;
