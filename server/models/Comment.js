import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    // Link to the post this comment belongs to
    post: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Post",
    },
    // Link to the user who wrote the comment
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    // The actual text content of the comment
    content: {
      type: String,
      required: [true, "Please add some content to your comment"],
      trim: true,
    },
  },
  {
    // Automatically add `createdAt` and `updatedAt` fields
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", CommentSchema);

export default Comment;
