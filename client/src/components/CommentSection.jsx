import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

// 1. Accept a new prop: onCommentAdded
const CommentSection = ({ postId, onCommentAdded }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/posts/${postId}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await api.post(`/posts/${postId}/comments`, { content: newComment });
      setComments([response.data, ...comments]);
      setNewComment('');
      
      // 2. Call the new function to notify the parent component
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-700">
      {user && (
        <form onSubmit={handleCommentSubmit} className="flex items-center space-x-2 mb-6">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-grow px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-3 rounded-lg transition duration-300">
            Send
          </button>
        </form>
      )}
      <div className="space-y-4">
        {loading ? (
          <p>Loading comments...</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="flex items-start space-x-3">
              <img 
                src={comment.user.profileImageUrl || 'https://placehold.co/32x32/1f2937/9ca3af?text=Dev'} 
                alt={`${comment.user.username}'s profile`}
                className="w-8 h-8 rounded-full"
              />
              <div className="bg-gray-700 p-3 rounded-lg flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-cyan-400 text-sm">{comment.user.username}</p>
                  <p className="text-xs text-gray-400">{formatDate(comment.createdAt)}</p>
                </div>
                <p className="text-gray-200 mt-1">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
