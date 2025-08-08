import express from 'express';
import {
  connectGitHub,
  syncGitHub,
  getGitHubRepositories,
  toggleRepositoryPin,
  disconnectGitHub
} from '../controllers/githubController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Connect GitHub account
// @route   POST /api/github/connect
// @access  Private
router.post('/connect', protect, connectGitHub);

// @desc    Sync GitHub data
// @route   PUT /api/github/sync
// @access  Private
router.put('/sync', protect, syncGitHub);

// @desc    Get GitHub repositories
// @route   GET /api/github/repositories
// @access  Private
router.get('/repositories', protect, getGitHubRepositories);

// @desc    Pin/Unpin repository
// @route   PUT /api/github/repositories/:repoId/pin
// @access  Private
router.put('/repositories/:repoId/pin', protect, toggleRepositoryPin);

// @desc    Disconnect GitHub account
// @route   DELETE /api/github/disconnect
// @access  Private
router.delete('/disconnect', protect, disconnectGitHub);

export default router;
