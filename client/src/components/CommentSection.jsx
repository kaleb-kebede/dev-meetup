import React, { useState, useEffect, useCallback, useRef } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { getProfileImageUrl } from '../utils/imageUtils';

// A single, recursive component for comments and their replies
const CommentItem = ({ comment, postId, onReplyAdded, depth = 0 }) => {
  const { user } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const replyTextareaRef = useRef(null);

  const authorUsername = comment.user?.username || 'User';
  const authorProfileImg = getProfileImageUrl(comment.user?.profileImageUrl, authorUsername);
  const isCurrentUser = user?._id === comment.user?._id;
  const maxDepth = 3; // Limit nesting depth

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim() || isSubmittingReply) return;
    
    try {
      setIsSubmittingReply(true);
      await api.post(`/posts/${postId}/comments/${comment._id}/reply`, { content: replyContent });
      toast.success('Reply added!');
      setReplyContent('');
      setShowReplyForm(false);
      onReplyAdded();
    } catch (error) {
      toast.error('Failed to add reply.');
      console.error('Failed to add reply:', error);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleReplyKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleReplySubmit(e);
    } else if (e.key === 'Escape') {
      setShowReplyForm(false);
      setReplyContent('');
    }
  };

  // Auto-focus reply textarea when opened
  useEffect(() => {
    if (showReplyForm && replyTextareaRef.current) {
      replyTextareaRef.current.focus();
    }
  }, [showReplyForm]);

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
        className="w-10 h-10 rounded-full ring-2 ring-cyan-500/20 object-cover"
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
          <div className="mt-3 flex items-center space-x-2">
            <button 
              onClick={() => setShowReplyForm(!showReplyForm)} 
              className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-200 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-all duration-200"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              <span>{showReplyForm ? 'Cancel' : 'Reply'}</span>
            </button>
            
            {/* Reply count indicator */}
            {comment.replies && comment.replies.length > 0 && (
              <span className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded-full text-xs text-gray-600 dark:text-gray-300">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span>{comment.replies.length}</span>
              </span>
            )}
          </div>
        )}
        
        {/* Reply Form */}
        {showReplyForm && (
          <div className="mt-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm">
            <form onSubmit={handleReplySubmit} className="space-y-3">
              <div className="flex items-start space-x-3">
                <img 
                  src={getProfileImageUrl(user?.profileImageUrl, user?.username)} 
                  alt="Your profile" 
                  className="w-8 h-8 rounded-full ring-1 ring-cyan-500/20 object-cover flex-shrink-0" 
                />
                <div className="flex-1">
                  <div className="relative">
                    <textarea
                      ref={replyTextareaRef}
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      onKeyDown={handleReplyKeyDown}
                      placeholder={`Replying to @${authorUsername}...`}
                      rows={2}
                      disabled={isSubmittingReply}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-200 resize-none placeholder-gray-500 dark:placeholder-gray-400"
                    />
                    {replyContent.trim() && (
                      <div className="absolute bottom-2 right-2 text-xs text-gray-400 pointer-events-none">
                        {replyContent.length}/500
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Reply Actions */}
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <span className="inline-flex items-center space-x-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" clipRule="evenodd" />
                    </svg>
                    <span>Ctrl+Enter to reply • Esc to cancel</span>
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowReplyForm(false);
                      setReplyContent('');
                    }}
                    disabled={isSubmittingReply}
                    className="px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!replyContent.trim() || isSubmittingReply}
                    className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmittingReply ? (
                      <div className="flex items-center space-x-2">
                        <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Replying...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        <span>Reply</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
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
  const [isCommentFocused, setIsCommentFocused] = useState(false);
  const commentTextareaRef = useRef(null);

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
    if (!newComment.trim() || submitting) return;
    
    try {
      setSubmitting(true);
      await api.post(`/posts/${postId}/comments`, { content: newComment });
      setNewComment('');
      setIsCommentFocused(false);
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

  const handleCommentKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleCommentSubmit(e);
    } else if (e.key === 'Escape') {
      setIsCommentFocused(false);
      commentTextareaRef.current?.blur();
    }
  };

  return (
    <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
      <div className="p-6">
        {/* Comment Input */}
        {user && (
          <div className={`p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm mb-6 transition-all duration-200 ${isCommentFocused ? 'ring-2 ring-cyan-500/50 border-cyan-500' : ''}`}>
            <form onSubmit={handleCommentSubmit} className="space-y-3">
              {/* Comment Header */}
              <div className="flex items-center space-x-3">
                <img 
                  src={getProfileImageUrl(user?.profileImageUrl, user?.username)} 
                  alt="Your profile" 
                  className="w-10 h-10 rounded-full ring-2 ring-cyan-500/20 object-cover flex-shrink-0" 
                />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Share your thoughts as {user.username}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {comments.length} {comments.length === 1 ? 'comment' : 'comments'} on this post
                  </p>
                </div>
              </div>

              {/* Comment Textarea */}
              <div className="relative">
                <textarea
                  ref={commentTextareaRef}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={handleCommentKeyDown}
                  onFocus={() => setIsCommentFocused(true)}
                  onBlur={() => setIsCommentFocused(false)}
                  placeholder="What are your thoughts on this post? Share your insights, ask questions, or start a discussion..."
                  rows={isCommentFocused ? 4 : 3}
                  disabled={submitting}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-200 resize-none placeholder-gray-500 dark:placeholder-gray-400"
                />
                {newComment.trim() && (
                  <div className="absolute bottom-3 right-3 text-xs text-gray-400 pointer-events-none">
                    {newComment.length}/1000
                  </div>
                )}
              </div>
              
              {/* Comment Actions */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-4">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="inline-flex items-center space-x-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span>Ctrl+Enter to post • Esc to unfocus</span>
                    </span>
                  </div>
                  
                  {/* Comment Stats */}
                  {comments.length > 0 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      <span className="inline-flex items-center space-x-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8z" />
                        </svg>
                        <span>{comments.reduce((acc, comment) => acc + 1 + (comment.replies?.length || 0), 0)} total responses</span>
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    type="submit"
                    disabled={!newComment.trim() || submitting}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {submitting ? (
                      <div className="flex items-center space-x-2">
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Publishing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        <span>Post Comment</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
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
