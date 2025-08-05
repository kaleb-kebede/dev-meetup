import mongoose from 'mongoose';
import crypto from 'crypto'; // Import crypto for token generation

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false,
  },
  bio: {
    type: String,
    default: ''
  },
  skills: {
    type: [String],
    default: []
  },
  profileImageUrl: {
    type: String,
    default: '' 
  },
  // --- NEW FIELDS FOR FOLLOWING SYSTEM ---
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
    // --- NEW FIELDS FOR PASSWORD RESET ---
  passwordResetToken: String,
  passwordResetExpires: Date,
}, {
  timestamps: true,
});

// --- NEW METHOD to generate reset token ---
UserSchema.methods.getPasswordResetToken = function() {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to passwordResetToken field
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire time (e.g., 10 minutes)
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken; // Return the unhashed token
};

const User = mongoose.model('User', UserSchema);

export default User;
