import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js"; //    /* getMe */
const router = express.Router();
// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", express.json(), registerUser);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", express.json(), loginUser);

// @route   GET api/auth/me
// @desc    Get logged in user's data
// @access  Private (we will add middleware later)
// router.get('/me', getMe); // We will uncomment this later
export default router;
