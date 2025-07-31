import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// A single, recursive component for comments and their replies
const CommentItem = ({ comment, postId, onReplyAdded }) => {
  const { user } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const authorUsername = comment.user?.username || 'User';
  const authorProfileImg = comment.user?.profileImageUrl || `https://placehold.co/40x40/E2E8F0/475569?text=${authorUsername.charAt(0)}`;

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    try {
      await api.post(`/posts/${postId}/comments/${comment._id}/reply`, { content: replyContent });
      toast.success('Reply added!');
      setReplyContent('');
      setShowReplyForm(false);
      onReplyAdded();
    } catch (error) {
      toast.error('Failed to add reply.');
      console.error('Failed to add reply:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex items-start space-x-3">
      <img 
        src={authorProfileImg} 
        alt={`${authorUsername}'s profile`}
        className="w-9 h-9 rounded-full"
      />
      <div className="flex-1">
        {/* --- THEME UPDATE --- */}
        <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="font-bold text-cyan-600 dark:text-cyan-400 text-sm">{authorUsername}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(comment.createdAt)}</p>
          </div>
          <p className="text-gray-800 dark:text-gray-200 mt-1 text-sm">{comment.content}</p>
        </div>
        {user && (
          <div className="mt-1 flex items-center space-x-3">
            <button onClick={() => setShowReplyForm(!showReplyForm)} className="text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400">
              {showReplyForm ? 'Cancel' : 'Reply'}
            </button>
          </div>
        )}
        {showReplyForm && (
          <form onSubmit={handleReplySubmit} className="mt-2 flex items-center space-x-2">
            <img src={user.profileImageUrl || `https://placehold.co/32x32/E2E8F0/475569?text=${user.username.charAt(0)}`} alt="Your profile" className="w-8 h-8 rounded-full" />
            <input
              type="text"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder={`Replying to ${authorUsername}...`}
              className="flex-grow px-3 py-2 bg-gray-200 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-full text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </form>
        )}
        <div className="mt-3 pl-4 border-l-2 border-gray-200 dark:border-gray-600 space-y-4">
          {comment.replies && comment.replies.map(reply => (
            <CommentItem key={reply._id} comment={reply} postId={postId} onReplyAdded={onReplyAdded} />
          ))}
        </div>
      </div>
    </div>
  );
};


// The main CommentSection component
const CommentSection = ({ postId, onCommentAdded }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/posts/${postId}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await api.post(`/posts/${postId}/comments`, { content: newComment });
      setNewComment('');
      onCommentAdded();
      fetchComments();
    } catch (error) {
      toast.error('Failed to add comment.');
      console.error('Failed to add comment:', error);
    }
  };

  return (
    // --- THEME UPDATE ---
    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
      {user && (
        <form onSubmit={handleCommentSubmit} className="flex items-start space-x-3 mb-6">
          <img src={user.profileImageUrl || `https://placehold.co/40x40/E2E8F0/475569?text=${user.username.charAt(0)}`} alt="Your profile" className="w-10 h-10 rounded-full" />
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-grow px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </form>
      )}
      <div className="space-y-4">
        {loading ? <p className="text-gray-500 dark:text-gray-400">Loading comments...</p> : (
          comments.map((comment) => (
            <CommentItem key={comment._id} comment={comment} postId={postId} onReplyAdded={fetchComments} />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
