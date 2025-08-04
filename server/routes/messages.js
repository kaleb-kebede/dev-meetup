import express from 'express'
const router = express.Router();
import { sendMessage, getMessages } from '../controllers/messageController.js'
import { protect } from '../middleware/authMiddleware.js';

// Send a message
router.post('/', protect, sendMessage);

// Get messages between two users
router.get('/:userId', protect, getMessages);

export default router
