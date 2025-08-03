import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CommentSection from './CommentSection';
import CodeSnippet from './CodeSnippet';
import toast from 'react-hot-toast';

const PostItem = ({ post, onLike, onCommentAdded, onToggleComments, isCommentsOpen, onDelete, onUpdate }) => {
  const { user } = useAuth();
  const isLikedByCurrentUser = user && post.likes.includes(user._id);
  const isAuthor = user && user._id === post.user._id;

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [editedImageUrl, setEditedImageUrl] = useState(post.imageUrl || '');
  const [editedCodeSnippet, setEditedCodeSnippet] = useState(post.codeSnippet || { code: '', language: 'javascript', title: '' });
  const [showOptions, setShowOptions] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const getFullImageUrl = (path) => {
    if (!path) return null;
    return `${API_BASE_URL.replace('/api', '')}${path}`;
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

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    const updateData = {
      content: editedContent,
      imageUrl: editedImageUrl,
      codeSnippet: editedCodeSnippet.code.trim() ? editedCodeSnippet : null
    };
    onUpdate(post._id, updateData);
    setIsEditing(false);
  };

  const handleRepost = () => toast('Repost feature coming soon!');
  const handleSend = () => toast('Send feature coming soon!');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Post Header */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <Link to={`/profile/${post.user.username}`}>
              <img 
                src={getFullImageUrl(post.user.profileImageUrl) || `https://placehold.co/48x48/E2E8F0/475569?text=${post.user.username.charAt(0)}`}
                alt={`${post.user.username}'s profile`}
                className="w-12 h-12 rounded-full ring-2 ring-cyan-500/20"
              />
            </Link>
            <div>
              <Link to={`/profile/${post.user.username}`} className="font-semibold text-gray-900 dark:text-white hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors duration-200">
                {post.user.username}
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(post.createdAt)} ago</p>
            </div>
          </div>
          
          {isAuthor && (
            <div className="relative">
              <button 
                onClick={() => setShowOptions(!showOptions)} 
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
              {showOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 z-10">
                  <button 
                    onClick={() => { setIsEditing(true); setShowOptions(false); }} 
                    className="block w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-t-xl transition-colors duration-200"
                  >
                    Edit Post
                  </button>
                  <button 
                    onClick={() => { if(window.confirm('Are you sure?')) onDelete(post._id); setShowOptions(false); }} 
                    className="block w-full text-left px-4 py-3 text-sm text-red-500 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-b-xl transition-colors duration-200"
                  >
                    Delete Post
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Body */}
      <div className="p-6">
        {isEditing ? (
          <form onSubmit={handleUpdateSubmit} className="space-y-4">
            <textarea 
              value={editedContent} 
              onChange={(e) => setEditedContent(e.target.value)} 
              className="w-full p-4 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50" 
              rows="3"
              placeholder="Post content..."
            />
            <input 
              type="url" 
              value={editedImageUrl} 
              onChange={(e) => setEditedImageUrl(e.target.value)} 
              className="w-full p-4 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50" 
              placeholder="Image URL"
            />
            
            {/* Code Snippet Edit Form */}
            <div className="border border-gray-200 dark:border-gray-600 rounded-xl p-4 bg-gray-50 dark:bg-gray-700">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Code Snippet</h4>
              <input
                type="text"
                value={editedCodeSnippet.title || ''}
                onChange={(e) => setEditedCodeSnippet({...editedCodeSnippet, title: e.target.value})}
                className="w-full p-3 mb-3 bg-white dark:bg-gray-600 rounded-lg text-gray-900 dark:text-white border border-gray-200 dark:border-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                placeholder="Snippet title (optional)"
              />
              <select
                value={editedCodeSnippet.language || 'javascript'}
                onChange={(e) => setEditedCodeSnippet({...editedCodeSnippet, language: e.target.value})}
                className="w-full p-3 mb-3 bg-white dark:bg-gray-600 rounded-lg text-gray-900 dark:text-white border border-gray-200 dark:border-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="csharp">C#</option>
                <option value="php">PHP</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="sql">SQL</option>
                <option value="bash">Bash</option>
              </select>
              <textarea
                value={editedCodeSnippet.code || ''}
                onChange={(e) => setEditedCodeSnippet({...editedCodeSnippet, code: e.target.value})}
                className="w-full p-3 bg-white dark:bg-gray-600 rounded-lg text-gray-900 dark:text-white font-mono text-sm border border-gray-200 dark:border-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                rows="6"
                placeholder="Paste your code here..."
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                type="button" 
                onClick={() => setIsEditing(false)} 
                className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Save
              </button>
            </div>
          </form>
        ) : (
          <>
            {post.content && (
              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap mb-6 text-lg leading-relaxed">{post.content}</p>
            )}
            
            {/* Code Snippet Display */}
            {post.codeSnippet && post.codeSnippet.code && (
              <div className="mb-6">
                <CodeSnippet 
                  code={post.codeSnippet.code}
                  language={post.codeSnippet.language}
                  title={post.codeSnippet.title}
                />
              </div>
            )}
            
            {post.imageUrl && (
              <div className="mb-6">
                <img 
                  src={getFullImageUrl(post.imageUrl)} 
                  alt="Post content" 
                  className="rounded-xl w-full object-cover shadow-md"
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Social Counts */}
      {(post.likes.length > 0 || post.comments.length > 0) && (
        <div className="px-6 py-3 border-t border-gray-100 dark:border-gray-700 flex justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>{post.likes.length > 0 && `${post.likes.length} Likes`}</span>
          <button 
            onClick={() => onToggleComments(post._id)} 
            className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors duration-200"
          >
            {post.comments.length > 0 && `${post.comments.length} Comments`}
          </button>
        </div>
      )}

      {/* Action Bar */}
      <div className="border-t border-gray-100 dark:border-gray-700">
        <div className="flex">
          <button 
            onClick={() => onLike(post._id)}
            disabled={!user}
            className={`flex-1 flex items-center justify-center space-x-2 py-4 transition-all duration-200 ${
              isLikedByCurrentUser 
                ? 'text-cyan-500 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20' 
                : 'text-gray-500 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isLikedByCurrentUser ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 18.331v-11h2.066a2 2 0 011.789 1.106l.823 2.468zM7 9V5a2 2 0 012-2h2a2 2 0 012 2v4z" />
            </svg>
            <span className="font-medium">Like</span>
          </button>
          <button 
            onClick={() => onToggleComments(post._id)}
            className="flex-1 flex items-center justify-center space-x-2 py-4 text-gray-500 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="font-medium">Comment</span>
          </button>
          <button 
            onClick={handleRepost}
            disabled={!user}
            className="flex-1 flex items-center justify-center space-x-2 py-4 text-gray-500 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5" />
            </svg>
            <span className="font-medium">Repost</span>
          </button>
          <button 
            onClick={handleSend}
            disabled={!user}
            className="flex-1 flex items-center justify-center space-x-2 py-4 text-gray-500 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span className="font-medium">Send</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {isCommentsOpen && (
        <div className="border-t border-gray-100 dark:border-gray-700">
          <CommentSection postId={post._id} onCommentAdded={onCommentAdded} />
        </div>
      )}
    </div>
  );
};

export default PostItem;
