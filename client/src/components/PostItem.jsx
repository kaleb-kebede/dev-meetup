import React, { useState } from 'react';
// ...existing code...
import DirectMessage from './DirectMessage';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CommentSection from './CommentSection';
import CodeSnippet from './CodeSnippet';
import ShareMenu from './ShareMenu';
import toast from 'react-hot-toast';
import { getProfileImageUrl, getPostImageUrl } from '../utils/imageUtils';

const PostItem = ({ post, onLike, onCommentAdded, onToggleComments, isCommentsOpen, onDelete, onUpdate }) => {
  const { user } = useAuth();
  const isLikedByCurrentUser = user && post.likes.includes(user._id);
  const isAuthor = user && user._id === post.user._id;

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [editedImageUrl, setEditedImageUrl] = useState(post.imageUrl || '');
  const [editedCodeSnippet, setEditedCodeSnippet] = useState(post.codeSnippet || { code: '', language: 'javascript', title: '' });
  const [showOptions, setShowOptions] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [isContentExpanded, setIsContentExpanded] = useState(false);

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
  // const { user } = useAuth();
  const handleSend = () => setShowMessageModal(true);

  // Function to determine if content should be collapsed
  const shouldCollapse = (content) => {
    return content && content.length > 300; // Collapse if more than 300 characters
  };

  // Function to get truncated content
  const getTruncatedContent = (content) => {
    if (!content) return '';
    return content.length > 300 ? content.substring(0, 300) + '...' : content;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
             {/* Direct Message Modal */}
       {showMessageModal && (
         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
           <div className="bg-transparent rounded-xl shadow-lg p-2 relative w-full max-w-2xl">
             <button
               className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white bg-white dark:bg-gray-800 rounded-full w-8 h-8 flex items-center justify-center shadow-lg z-10"
               onClick={() => setShowMessageModal(false)}
             >
               &times;
             </button>
             <DirectMessage currentUserId={user._id} otherUserId={post.user._id} otherUserName={post.user.username} />
           </div>
         </div>
       )}
      {/* Developer-style Post Header */}
      <div className="bg-gray-50 p-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Link to={`/profile/${post.user.username}`}>
              <img 
                src={getProfileImageUrl(post.user.profileImageUrl, post.user.username)}
                alt={`${post.user.username}'s profile`}
                className="w-10 h-10 rounded-full border-2 border-gray-300 object-cover"
              />
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Link to={`/profile/${post.user.username}`} className="font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200 font-mono">
                  {post.user.username}
                </Link>
                <span className="text-gray-400 font-mono text-sm">@devmeetup</span>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span className="text-sm text-gray-500 font-mono">{formatDate(post.createdAt)}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1 font-mono">
                <i className="fas fa-terminal text-gray-400 mr-1"></i>
                ~/posts/{post._id.slice(-8)}.js
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Post Type Badge */}
            <div className="flex items-center gap-1">
              {post.codeSnippet && post.codeSnippet.code && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-mono">
                  <i className="fas fa-code mr-1"></i>code
                </span>
              )}
              {post.imageUrl && (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-mono">
                  <i className="fas fa-image mr-1"></i>media
                </span>
              )}
            </div>
            
            {isAuthor && (
              <div className="relative">
                <button 
                  onClick={() => setShowOptions(!showOptions)} 
                  className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-200 transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
                {showOptions && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <button 
                      onClick={() => { setIsEditing(true); setShowOptions(false); }} 
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg transition-colors duration-200 font-mono"
                    >
                      <i className="fas fa-edit mr-2 text-blue-500"></i>edit
                    </button>
                    <button 
                      onClick={() => { if(window.confirm('Delete this post?')) onDelete(post._id); setShowOptions(false); }} 
                      className="block w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-gray-50 rounded-b-lg transition-colors duration-200 font-mono"
                    >
                      <i className="fas fa-trash mr-2"></i>delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Post Body */}
      <div className="p-6">
        {isEditing ? (
          <form onSubmit={handleUpdateSubmit} className="space-y-4">
            <textarea 
              value={editedContent} 
              onChange={(e) => setEditedContent(e.target.value)} 
              className="w-full p-4 bg-gray-50 rounded-xl text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50" 
              rows="3"
              placeholder="Post content..."
            />
            <input 
              type="url" 
              value={editedImageUrl} 
              onChange={(e) => setEditedImageUrl(e.target.value)} 
              className="w-full p-4 bg-gray-50 rounded-xl text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50" 
              placeholder="Image URL"
            />
            
            {/* Code Snippet Edit Form */}
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Code Snippet</h4>
              <input
                type="text"
                value={editedCodeSnippet.title || ''}
                onChange={(e) => setEditedCodeSnippet({...editedCodeSnippet, title: e.target.value})}
                className="w-full p-3 mb-3 bg-white rounded-lg text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                placeholder="Snippet title (optional)"
              />
              <select
                value={editedCodeSnippet.language || 'javascript'}
                onChange={(e) => setEditedCodeSnippet({...editedCodeSnippet, language: e.target.value})}
                className="w-full p-3 mb-3 bg-white rounded-lg text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
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
                className="w-full p-3 bg-white rounded-lg text-gray-900 font-mono text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
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
              <div className="mb-6">
                <p className="text-gray-800 whitespace-pre-wrap text-lg leading-relaxed">
                  {isContentExpanded ? post.content : getTruncatedContent(post.content)}
                </p>
                {shouldCollapse(post.content) && (
                  <button
                    onClick={() => setIsContentExpanded(!isContentExpanded)}
                    className="mt-2 text-cyan-600 hover:text-cyan-700 font-medium text-sm transition-colors duration-200"
                  >
                    {isContentExpanded ? 'Show less' : 'Show more'}
                  </button>
                )}
              </div>
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
                  src={getPostImageUrl(post.imageUrl)} 
                  alt="Post content" 
                  className="rounded-xl w-full object-cover shadow-md"
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Developer Stats Bar */}
      {(post.likes.length > 0 || post.comments.length > 0) && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-4 font-mono">
            {post.likes.length > 0 && (
              <span className="flex items-center gap-1">
                <i className="fas fa-thumbs-up text-blue-500"></i>
                {post.likes.length} likes
              </span>
            )}
            {post.comments.length > 0 && (
              <button 
                onClick={() => onToggleComments(post._id)} 
                className="flex items-center gap-1 hover:text-blue-600 transition-colors duration-200"
              >
                <i className="fas fa-comments text-green-500"></i>
                {post.comments.length} comments
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <span className="font-mono">engagement: {((post.likes.length + post.comments.length) * 1.2).toFixed(0)}%</span>
          </div>
        </div>
      )}

      {/* Developer Action Bar */}
      <div className="border-t border-gray-200 bg-white">
        <div className="grid grid-cols-4 divide-x divide-gray-200">
          <button 
            onClick={() => onLike(post._id)}
            disabled={!user}
            className={`flex items-center justify-center gap-2 py-3 transition-all duration-200 font-mono text-sm ${
              isLikedByCurrentUser 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <i className={`fas fa-thumbs-up ${isLikedByCurrentUser ? 'text-blue-600' : 'text-gray-400'}`}></i>
            <span>like</span>
          </button>
          <button 
            onClick={() => onToggleComments(post._id)}
            className="flex items-center justify-center gap-2 py-3 text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all duration-200 font-mono text-sm"
          >
            <i className="fas fa-comments text-gray-400"></i>
            <span>comment</span>
          </button>
          <button 
            onClick={handleRepost}
            disabled={!user}
            className="flex items-center justify-center gap-2 py-3 text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200 font-mono text-sm"
          >
            <i className="fas fa-retweet text-gray-400"></i>
            <span>fork</span>
          </button>
          {/* Share Menu: developer-friendly */}
          <ShareMenu 
            postId={post._id}
            post={post}
            codeSnippet={post.codeSnippet}
            getPostUrl={(id) => `${window.location.origin}/posts/${id}`}
          />
        </div>
      </div>

      {/* Comments Section */}
      {isCommentsOpen && (
        <div className="border-t border-gray-100">
          <CommentSection postId={post._id} onCommentAdded={onCommentAdded} />
        </div>
      )}
    </div>
  );
};

export default PostItem;
