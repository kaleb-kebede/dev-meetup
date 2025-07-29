import Post from '../models/Post.js';
import User from '../models/User.js';
import Comment from '../models/Comment.js';

// ... (createPost, getAllPosts, likePost, addComment, getCommentsForPost functions remain the same) ...

// @desc    Create a new post
export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Post content cannot be empty' });
    }
    const newPost = new Post({ content, user: req.user.id });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all posts (the public feed)
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({}).sort({ createdAt: -1 }).populate('user', 'username profileImageUrl');
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Like or unlike a post
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const currentUserId = req.user._id.toString();
    const isLiked = post.likes.some(likeId => likeId.toString() === currentUserId);
    if (isLiked) {
      post.likes = post.likes.filter((likeId) => likeId.toString() !== currentUserId);
    } else {
      post.likes.push(req.user._id);
    }
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add a comment to a post
export const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Comment content cannot be empty' });
    }
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const newComment = new Comment({ content, user: req.user.id, post: req.params.postId });
    const savedComment = await newComment.save();
    post.comments.push(savedComment._id);
    await post.save();
    const populatedComment = await Comment.findById(savedComment._id).populate('user', 'username profileImageUrl');
    res.status(201).json(populatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all comments for a post
export const getCommentsForPost = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId }).sort({ createdAt: 'asc' }).populate('user', 'username profileImageUrl');
    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


// --- NEW FEED FUNCTION ---

// @desc    Get posts from users the current user is following
// @route   GET /api/posts/feed
// @access  Private
export const getFollowingFeed = async (req, res) => {
  try {
    // 1. Get the currently logged-in user from the 'protect' middleware
    const currentUser = await User.findById(req.user.id);

    // 2. Get the list of user IDs that the current user is following
    const followingIds = currentUser.following;

    // 3. Find all posts where the 'user' field is in the 'followingIds' array
    const feedPosts = await Post.find({ user: { $in: followingIds } })
      .sort({ createdAt: -1 })
      .populate('user', 'username profileImageUrl');

    res.status(200).json(feedPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
