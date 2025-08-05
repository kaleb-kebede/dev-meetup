// import { InsertMany } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import crypto from 'crypto';

// A helper function to generate a JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token will expire in 30 days
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 3. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create the new user in the database
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // 5. If user created successfully, send back user data and a token
    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find the user by email
    // We use .select('+password') because we set `select: false` in the model
    const user = await User.findOne({ email }).select("+password");

    // 2. Check if user exists and if the password matches
    if (user && (await bcrypt.compare(password, user.password))) {
      // 3. If credentials are correct, send back user data and a token
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// --- NEW PASSWORD RESET FUNCTIONS ---

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
export const forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: 'There is no user with that email' });
        }

        // Get reset token from the method we created on the User model
        const resetToken = user.getPasswordResetToken();
        await user.save({ validateBeforeSave: false });

        // In a real app, you would email this token to the user.
        // For our simulation, we will log it to the console.
        console.log('--- PASSWORD RESET TOKEN ---');
        console.log('This would normally be emailed to the user.');
        console.log(`Token: ${resetToken}`);
        console.log('----------------------------');

        res.status(200).json({ success: true, data: 'Password reset token generated. Check the server console.' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
export const resetPassword = async (req, res) => {
    try {
        // 1. Get hashed token from the URL
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.resettoken)
            .digest('hex');

        // 2. Find user by the hashed token and check if it has not expired
        const user = await User.findOne({
            passwordResetToken: resetPasswordToken,
            passwordResetExpires: { $gt: Date.now() }, // $gt means "greater than"
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // 3. Set new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        res.status(200).json({ success: true, data: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

