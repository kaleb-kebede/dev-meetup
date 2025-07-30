import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CommentSection from './CommentSection';
import toast from 'react-hot-toast';

// 1. Accept a new prop: onUpdate
const PostItem = ({ post, onLike, onCommentAdded, onToggleComments, isCommentsOpen, onDelete, onUpdate }) => {
  const { user } = useAuth();
  const isLikedByCurrentUser = user && post.likes.includes(user._id);
  const isAuthor = user && user._id === post.user._id;

  // 2. State to manage edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [editedImageUrl, setEditedImageUrl] = useState(post.imageUrl || '');

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleLikeClick = () => {
    if (user) onLike(post._id);
  };
  
  const handleDeleteClick = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      onDelete(post._id);
    }
  };

  // 3. Handle the submission of the edit form
  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (!editedContent.trim()) {
      toast.error('Post content cannot be empty.');
      return;
    }
    onUpdate(post._id, { content: editedContent, imageUrl: editedImageUrl });
    setIsEditing(false); // Exit edit mode after submitting
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex items-center mb-4">
          <img 
            src={post.user.profileImageUrl || 'https://placehold.co/40x40/1f2937/9ca3af?text=Dev'} 
            alt={`${post.user.username}'s profile`}
            className="w-10 h-10 rounded-full mr-4"
          />
          <div>
            <Link to={`/profile/${post.user.username}`} className="font-bold text-cyan-400 hover:underline">
              {post.user.username}
            </Link>
            <p className="text-sm text-gray-400">{formatDate(post.createdAt)}</p>
          </div>
        </div>
        {isAuthor && (
          <div className="flex space-x-2">
            {/* 4. Edit Button */}
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="text-gray-400 hover:text-cyan-400 transition-colors duration-200"
              title="Edit post"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
            <button 
              onClick={handleDeleteClick}
              className="text-gray-400 hover:text-red-500 transition-colors duration-200"
              title="Delete post"
            >
              &#x2715;
            </button>
          </div>
        )}
      </div>
      
      {/* 5. Conditionally render either the post content or the edit form */}
      {isEditing ? (
        <form onSubmit={handleUpdateSubmit}>
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full p-2 mb-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            rows="3"
          />
          <input
            type="url"
            value={editedImageUrl}
            onChange={(e) => setEditedImageUrl(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            placeholder="Image URL"
          />
          <div className="flex justify-end mt-2">
            <button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-1 px-3 rounded-lg">
              Save
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-4">
          <p className="text-gray-200">{post.content}</p>
          {post.imageUrl && (
            <img 
              src={post.imageUrl}
              alt="Post content"
              className="mt-4 rounded-lg w-full object-cover"
            />
          )}
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center text-gray-400 space-x-4">
        <button 
          onClick={handleLikeClick}
          className={`flex items-center space-x-2 hover:text-cyan-400 ${isLikedByCurrentUser ? 'text-cyan-400' : ''}`}
          disabled={!user}
        >
          <span>👍</span>
          <span>{post.likes.length} Likes</span>
        </button>
        <button onClick={() => onToggleComments(post._id)} className="flex items-center space-x-2 hover:text-cyan-400">
          <span>💬</span>
          <span>{post.comments.length} Comments</span>
        </button>
      </div>

      {isCommentsOpen && <CommentSection postId={post._id} onCommentAdded={onCommentAdded} />}
    </div>
  );
};

export default PostItem;
