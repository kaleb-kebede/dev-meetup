import Post from '../models/Post.js';
import User from '../models/User.js';
import Comment from '../models/Comment.js';

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res) => {
  try {
    // 1. Destructure both content and imageUrl from the request body
    const { content, imageUrl } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Post content cannot be empty' });
    }

    // 2. Include the imageUrl when creating the new post
    const newPost = new Post({
      content,
      imageUrl, // Add the imageUrl here
      user: req.user.id,
    });

    const savedPost = await newPost.save();

    // Populate the user data before sending the response
    const populatedPost = await Post.findById(savedPost._id).populate('user', 'username profileImageUrl');

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ... (getAllPosts, likePost, addComment, getCommentsForPost, getFollowingFeed, deletePost functions remain the same) ...
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({}).sort({ createdAt: -1 }).populate('user', 'username profileImageUrl');
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

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

export const getCommentsForPost = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId }).sort({ createdAt: 'asc' }).populate('user', 'username profileImageUrl');
    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getFollowingFeed = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const followingIds = currentUser.following;
    const feedPosts = await Post.find({ user: { $in: followingIds } })
      .sort({ createdAt: -1 })
      .populate('user', 'username profileImageUrl');
    res.status(200).json(feedPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await Comment.deleteMany({ post: req.params.id });
    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Post removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
