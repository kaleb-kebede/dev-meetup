import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CommentSection from './CommentSection';

// 1. Accept a new prop: onDelete
const PostItem = ({ post, onLike, onCommentAdded, onToggleComments, isCommentsOpen, onDelete }) => {
  const { user } = useAuth();
  const isLikedByCurrentUser = user && post.likes.includes(user._id);
  
  // 2. Check if the current user is the author of the post
  const isAuthor = user && user._id === post.user._id;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleLikeClick = () => {
    if (user) {
      onLike(post._id);
    }
  };
  
  const handleDeleteClick = () => {
    // We'll add a confirmation dialog here for better UX
    if (window.confirm('Are you sure you want to delete this post?')) {
      onDelete(post._id);
    }
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
        {/* 3. Conditionally render the delete button */}
        {isAuthor && (
          <button 
            onClick={handleDeleteClick}
            className="text-gray-400 hover:text-red-500 transition-colors duration-200"
            title="Delete post"
          >
            {/* Using a simple 'X' for the delete icon */}
            &#x2715;
          </button>
        )}
      </div>
      <p className="text-gray-200 mb-4">{post.content}</p>
      <div className="flex items-center text-gray-400 space-x-4">
        <button 
          onClick={handleLikeClick}
          className={`flex items-center space-x-2 hover:text-cyan-400 transition-colors duration-200 ${isLikedByCurrentUser ? 'text-cyan-400' : ''}`}
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
