import User from '../models/User.js';
import Post from '../models/Post.js';

// ... (getUserProfile, followUser, updateUserProfile, searchUsers functions remain the same) ...
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate('user', 'username profileImageUrl');

    res.status(200).json({
      profile: {
        _id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        skills: user.skills,
        profileImageUrl: user.profileImageUrl,
        createdAt: user.createdAt,
        followers: user.followers,
        following: user.following,
      },
      posts: posts,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (userToFollow.id === currentUser.id) {
      return res.status(400).json({ message: "You can't follow yourself" });
    }

    const isFollowing = currentUser.following.some(
      (id) => id.toString() === userToFollow.id
    );

    if (isFollowing) {
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== userToFollow.id
      );
      userToFollow.followers = userToFollow.followers.filter(
        (id) => id.toString() !== currentUser.id
      );
    } else {
      currentUser.following.push(userToFollow.id);
      userToFollow.followers.push(currentUser.id);
    }

    await currentUser.save();
    await userToFollow.save();

    res.status(200).json({ message: 'User follow status updated successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.bio = req.body.bio || user.bio;
      user.skills = req.body.skills || user.skills;
      
      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        bio: updatedUser.bio,
        skills: updatedUser.skills,
        profileImageUrl: updatedUser.profileImageUrl,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const searchQuery = req.query.q;

    if (!searchQuery) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const searchRegex = new RegExp(searchQuery, 'i');

    const users = await User.find({ 
      username: searchRegex,
      _id: { $ne: req.user.id }
    }).select('username profileImageUrl');

    res.status(200).json(users);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


// --- NEW: Update Profile Picture Function ---
// @desc    Update user profile picture URL
// @route   PUT /api/users/profile/picture
// @access  Private
export const updateProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      // Get the image URL from the request body
      user.profileImageUrl = req.body.imageUrl || user.profileImageUrl;

      const updatedUser = await user.save();

      // Send back the relevant parts of the updated user
      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        profileImageUrl: updatedUser.profileImageUrl,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
