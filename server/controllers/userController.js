import User from '../models/User.js';
import Post from '../models/Post.js';

// ... (getUserProfile, followUser, updateUserProfile functions remain the same) ...
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


// --- NEW: Search Users Function ---
// @desc    Search for users by username
// @route   GET /api/users/search?q=...
// @access  Private
export const searchUsers = async (req, res) => {
  try {
    // Get the search query from the URL query parameters (e.g., ?q=test)
    const searchQuery = req.query.q;

    if (!searchQuery) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Create a case-insensitive regular expression for the search
    const searchRegex = new RegExp(searchQuery, 'i');

    // Find users whose username matches the search query
    // We also exclude the current user from the search results
    const users = await User.find({ 
      username: searchRegex,
      _id: { $ne: req.user.id } // $ne means "not equal to"
    }).select('username profileImageUrl'); // Only select the fields we need

    res.status(200).json(users);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
