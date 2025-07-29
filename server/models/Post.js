import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  // The 'user' field links this post to the User who created it.
  // 'type: mongoose.Schema.Types.ObjectId' is the standard way to link documents.
  // 'ref: 'User'' tells Mongoose that this ID refers to a document in the 'User' collection.
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  content: {
    type: String,
    required: [true, 'Please add some content to your post'],
    trim: true,
  },
  // We will add more fields like code snippets and images later.
  likes: {
    type: [mongoose.Schema.Types.ObjectId], // An array of User IDs who liked the post
    ref: 'User',
    default: [],
  },
  comments: {
    type: [mongoose.Schema.Types.ObjectId], // An array of Comment IDs
    ref: 'Comment',
    default: [],
  },
}, {
  // Automatically add `createdAt` and `updatedAt` fields
  timestamps: true,
});

const Post = mongoose.model('Post', PostSchema);

export default Post;
