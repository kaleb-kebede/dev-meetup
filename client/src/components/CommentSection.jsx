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
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m";
    return Math.floor(seconds) + "s";
  };

  return (
    <div className="flex items-start space-x-3">
      <img 
        src={authorProfileImg} 
        alt={`${authorUsername}'s profile`}
        className="w-10 h-10 rounded-full ring-2 ring-cyan-500/20"
      />
      <div className="flex-1">
        {/* Comment Content */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-gray-900 dark:text-white text-sm">
              {authorUsername}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(comment.createdAt)} ago
            </span>
          </div>
          <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
            {comment.content}
          </p>
        </div>
        
        {/* Reply Button */}
        {user && (
          <div className="mt-2">
            <button 
              onClick={() => setShowReplyForm(!showReplyForm)} 
              className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors duration-200"
            >
              {showReplyForm ? 'Cancel' : 'Reply'}
            </button>
          </div>
        )}
        
        {/* Reply Form */}
        {showReplyForm && (
          <form onSubmit={handleReplySubmit} className="mt-3 flex items-start space-x-3">
            <img 
              src={user.profileImageUrl || `https://placehold.co/32x32/E2E8F0/475569?text=${user.username.charAt(0)}`} 
              alt="Your profile" 
              className="w-8 h-8 rounded-full ring-1 ring-cyan-500/20" 
            />
            <div className="flex-1">
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`Replying to ${authorUsername}...`}
                className="w-full px-4 py-2 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-200"
              />
              <div className="flex justify-end mt-2 space-x-2">
                <button
                  type="button"
                  onClick={() => setShowReplyForm(false)}
                  className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-xs bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg transition-all duration-200"
                >
                  Reply
                </button>
              </div>
            </div>
          </form>
        )}
        
        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 ml-4 pl-4 border-l-2 border-gray-200 dark:border-gray-600 space-y-4">
            {comment.replies.map(reply => (
              <CommentItem key={reply._id} comment={reply} postId={postId} onReplyAdded={onReplyAdded} />
            ))}
          </div>
        )}
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
  const [submitting, setSubmitting] = useState(false);

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
      setSubmitting(true);
      await api.post(`/posts/${postId}/comments`, { content: newComment });
      setNewComment('');
      onCommentAdded();
      fetchComments();
      toast.success('Comment added!');
    } catch (error) {
      toast.error('Failed to add comment.');
      console.error('Failed to add comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
      <div className="p-6">
        {/* Comment Input */}
        {user && (
          <form onSubmit={handleCommentSubmit} className="flex items-start space-x-3 mb-6">
            <img 
              src={user.profileImageUrl || `https://placehold.co/40x40/E2E8F0/475569?text=${user.username.charAt(0)}`} 
              alt="Your profile" 
              className="w-10 h-10 rounded-full ring-2 ring-cyan-500/20" 
            />
            <div className="flex-1">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-200"
                disabled={submitting}
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={!newComment.trim() || submitting}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {submitting ? (
                    <div className="flex items-center space-x-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Posting...</span>
                    </div>
                  ) : (
                    'Post Comment'
                  )}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No comments yet. Be the first to share your thoughts!
              </p>
            </div>
          ) : (
            comments.map((comment) => (
              <CommentItem key={comment._id} comment={comment} postId={postId} onReplyAdded={fetchComments} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
