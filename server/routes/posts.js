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
    updatePost,
    addReplyToComment // 1. Import the new reply function
} from '../controllers/postController.js';

// --- Personalized Feed Route ---
router.get('/feed', protect, getFollowingFeed);


// --- Post Routes ---
router.route('/')
  .post(protect, createPost)
  .get(getAllPosts);

// --- Like, Delete, and Edit Routes for a specific post ---
router.route('/:id')
  .delete(protect, deletePost)
  .put(protect, updatePost)
  .patch(protect, likePost);

// --- Comment Routes ---
router.route('/:postId/comments')
  .post(protect, addComment)
  .get(getCommentsForPost);

// --- NEW: Reply to Comment Route ---
// 2. Add the new route for replying to a specific comment
router.route('/:postId/comments/:commentId/reply')
    .post(protect, addReplyToComment);

export default router;
