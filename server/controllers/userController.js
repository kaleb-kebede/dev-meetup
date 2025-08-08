import User from '../models/User.js';
import Post from '../models/Post.js';

// Get all users for suggestions with current user's following info
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'username firstName lastName bio profileImageUrl createdAt')
      .sort({ createdAt: -1 })
      .limit(50); // Limit to prevent performance issues

    // Get current user's following list
    const currentUser = await User.findById(req.user.id, 'following');
    const followingIds = currentUser ? currentUser.following.map(id => id.toString()) : [];

    // Add following status to each user
    const usersWithFollowingStatus = users.map(user => ({
      ...user.toObject(),
      isFollowing: followingIds.includes(user._id.toString())
    }));

    res.status(200).json(usersWithFollowingStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

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
        firstName: user.firstName,
        lastName: user.lastName,
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
      const firstName = typeof req.body.firstName === 'string' ? req.body.firstName.trim() : undefined;
      const lastName = typeof req.body.lastName === 'string' ? req.body.lastName.trim() : undefined;

      if (firstName !== undefined) user.firstName = firstName;
      if (lastName !== undefined) user.lastName = lastName;

      user.bio = req.body.bio ?? user.bio;
      user.skills = Array.isArray(req.body.skills) ? req.body.skills : (req.body.skills ?? user.skills);
      
      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
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
    const query = req.query.q;
    
    if (!query || query.trim() === '') {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const users = await User.find({
      username: { $regex: query, $options: 'i' }
    }, 'username bio profileImageUrl')
    .limit(10);

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newUrl = req.body.imageUrl || req.body.profileImageUrl || '';
    user.profileImageUrl = newUrl;
    await user.save();

    res.json({
      _id: user._id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      bio: user.bio,
      skills: user.skills,
      profileImageUrl: user.profileImageUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
