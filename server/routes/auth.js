import express from "express";
import { 
    registerUser, 
    loginUser, 
    forgotPassword, // 1. Import new functions
    resetPassword} from "../controllers/authController.js"; //    /* getMe */
const router = express.Router();
// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", express.json(), registerUser);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", express.json(), loginUser);

// @route   POST api/auth/forgotpassword
// @desc    Send password reset email
// @access  Public
// This route will be used to send a password reset email
// It will be called when the user clicks "Forgot Password?"
router.post('/forgotpassword', forgotPassword);

// @route   PUT api/auth/resetpassword/:resettoken
// @desc    Reset user password
// @access  Public
router.put('/resetpassword/:resettoken', resetPassword);

// @route   GET api/auth/me
// @desc    Get logged in user's data
// @access  Private (we will add middleware later)
// router.get('/me', getMe); // We will uncomment this later
export default router;
