import Post from "../models/Post.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";

// ... (all other controller functions remain the same) ...

export const createPost = async (req, res) => {
  try {
    const { content, imageUrl, codeSnippet } = req.body;
    if (!content && !imageUrl && !codeSnippet?.code) {
      return res.status(400).json({ message: "Post must have content, image, or code snippet" });
    }
    const newPost = new Post({ content, imageUrl, codeSnippet, user: req.user.id });
    const savedPost = await newPost.save();
    const populatedPost = await Post.findById(savedPost._id).populate(
      "user",
      "username profileImageUrl"
    );
    res.status(201).json(populatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .populate("user", "username profileImageUrl");
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const currentUserId = req.user._id.toString();
    const isLiked = post.likes.some(
      (likeId) => likeId.toString() === currentUserId
    );
    if (isLiked) {
      post.likes = post.likes.filter(
        (likeId) => likeId.toString() !== currentUserId
      );
    } else {
      post.likes.push(req.user._id);
    }
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res
        .status(400)
        .json({ message: "Comment content cannot be empty" });
    }
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const newComment = new Comment({
      content,
      user: req.user.id,
      post: req.params.postId,
    });
    const savedComment = await newComment.save();
    post.comments.push(savedComment._id);
    await post.save();
    const populatedComment = await Comment.findById(savedComment._id).populate(
      "user",
      "username profileImageUrl"
    );
    res.status(201).json(populatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// --- UPDATED getCommentsForPost FUNCTION ---
export const getCommentsForPost = async (req, res) => {
  try {
    // This population structure will fetch replies, and the replies of those replies.
    const comments = await Comment.find({
      post: req.params.postId,
      parentComment: null,
    })
      .sort({ createdAt: "asc" })
      .populate("user", "username profileImageUrl")
      .populate({
        path: "replies",
        populate: [
          {
            path: "user",
            select: "username profileImageUrl",
          },
          {
            path: "replies", // This fetches the second level of replies
            populate: {
              path: "user",
              select: "username profileImageUrl",
            },
          },
        ],
      });

    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getFollowingFeed = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const followingIds = currentUser.following;
    const feedPosts = await Post.find({ user: { $in: followingIds } })
      .sort({ createdAt: -1 })
      .populate("user", "username profileImageUrl");
    res.status(200).json(feedPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }
    await Comment.deleteMany({ post: req.params.id });
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }
    post.content = req.body.content || post.content;
    post.imageUrl = req.body.imageUrl || post.imageUrl;
    post.codeSnippet = req.body.codeSnippet || post.codeSnippet;
    const updatedPost = await post.save();
    const populatedPost = await Post.findById(updatedPost._id).populate(
      "user",
      "username profileImageUrl"
    );
    res.status(200).json(populatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const addReplyToComment = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: "Reply content cannot be empty" });
    }
    const parentComment = await Comment.findById(req.params.commentId);
    if (!parentComment) {
      return res.status(404).json({ message: "Parent comment not found" });
    }
    const newReply = new Comment({
      content,
      user: req.user.id,
      post: req.params.postId,
      parentComment: req.params.commentId,
    });
    const savedReply = await newReply.save();
    parentComment.replies.push(savedReply._id);
    await parentComment.save();
    const populatedReply = await Comment.findById(savedReply._id).populate(
      "user",
      "username profileImageUrl"
    );
    res.status(201).json(populatedReply);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
