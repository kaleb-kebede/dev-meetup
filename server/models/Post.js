import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
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
  // --- NEW FIELD FOR IMAGE URL ---
  imageUrl: {
    type: String,
    default: '',
  },
  // --- NEW FIELDS FOR CODE SNIPPETS ---
  codeSnippet: {
    code: {
      type: String,
      default: '',
    },
    language: {
      type: String,
      default: 'javascript',
    },
    title: {
      type: String,
      default: '',
    },
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  },
  comments: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Comment',
    default: [],
  },
}, {
  timestamps: true,
});

const Post = mongoose.model('Post', PostSchema);

export default Post;
