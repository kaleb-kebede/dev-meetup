import mongoose from 'mongoose';
import crypto from 'crypto'; // Import crypto for token generation

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please provide a first name'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Please provide a last name'],
    trim: true,
  },
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
  // --- NEW FIELDS FOR GITHUB INTEGRATION ---
  githubData: {
    username: {
      type: String,
      default: ''
    },
    profileUrl: {
      type: String,
      default: ''
    },
    avatarUrl: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      default: ''
    },
    publicRepos: {
      type: Number,
      default: 0
    },
    followers: {
      type: Number,
      default: 0
    },
    following: {
      type: Number,
      default: 0
    },
    location: {
      type: String,
      default: ''
    },
    company: {
      type: String,
      default: ''
    },
    blog: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date
    },
    updatedAt: {
      type: Date
    }
  },
  githubRepositories: [{
    id: Number,
    name: String,
    fullName: String,
    description: String,
    htmlUrl: String,
    language: String,
    stargazersCount: Number,
    forksCount: Number,
    size: Number,
    defaultBranch: String,
    createdAt: Date,
    updatedAt: Date,
    pushedAt: Date,
    topics: [String],
    isPinned: {
      type: Boolean,
      default: false
    }
  }],
  githubStats: {
    totalCommits: {
      type: Number,
      default: 0
    },
    totalStars: {
      type: Number,
      default: 0
    },
    totalForks: {
      type: Number,
      default: 0
    },
    primaryLanguages: [{
      language: String,
      percentage: Number
    }],
    contributionGraph: {
      type: Map,
      of: Number,
      default: new Map()
    },
    lastSynced: {
      type: Date
    }
  },
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
