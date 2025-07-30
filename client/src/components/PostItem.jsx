import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CommentSection from './CommentSection';

const PostItem = ({ post, onLike, onCommentAdded, onToggleComments, isCommentsOpen, onDelete, onUpdate }) => {
  const { user } = useAuth();
  const isLikedByCurrentUser = user && post.likes.includes(user._id);
  const isAuthor = user && user._id === post.user._id;

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [editedImageUrl, setEditedImageUrl] = useState(post.imageUrl || '');
  const [showOptions, setShowOptions] = useState(false); // For the '...' menu

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
    onUpdate(post._id, { content: editedContent, imageUrl: editedImageUrl });
    setIsEditing(false);
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Post Header */}
      <div className="p-4 flex items-start justify-between">
        <div className="flex items-center">
          <Link to={`/profile/${post.user.username}`}>
            <img 
              src={post.user.profileImageUrl || `https://placehold.co/48x48/1f2937/9ca3af?text=${post.user.username.charAt(0)}`}
              alt={`${post.user.username}'s profile`}
              className="w-12 h-12 rounded-full mr-4"
            />
          </Link>
          <div>
            <Link to={`/profile/${post.user.username}`} className="font-bold text-white hover:underline">
              {post.user.username}
            </Link>
            <p className="text-xs text-gray-400">{formatDate(post.createdAt)} ago</p>
          </div>
        </div>
        {isAuthor && (
          <div className="relative">
            <button onClick={() => setShowOptions(!showOptions)} className="text-gray-400 hover:text-white p-2 rounded-full">
              &#x2022;&#x2022;&#x2022;
            </button>
            {showOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg z-10">
                <button onClick={() => { setIsEditing(true); setShowOptions(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-600">Edit Post</button>
                <button onClick={() => { if(window.confirm('Are you sure?')) onDelete(post._id); setShowOptions(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-600">Delete Post</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Body */}
      <div className="px-4 pb-2">
        {isEditing ? (
          <form onSubmit={handleUpdateSubmit}>
            <textarea value={editedContent} onChange={(e) => setEditedContent(e.target.value)} className="w-full p-2 mb-2 bg-gray-700 rounded-lg text-white" rows="3"/>
            <input type="url" value={editedImageUrl} onChange={(e) => setEditedImageUrl(e.target.value)} className="w-full p-2 bg-gray-700 rounded-lg text-white" placeholder="Image URL"/>
            <div className="flex justify-end mt-2 space-x-2">
              <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-1 px-3 rounded-lg">Cancel</button>
              <button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-1 px-3 rounded-lg">Save</button>
            </div>
          </form>
        ) : (
          <>
            <p className="text-gray-200 whitespace-pre-wrap">{post.content}</p>
            {post.imageUrl && <img src={post.imageUrl} alt="Post content" className="mt-4 rounded-lg w-full object-cover"/>}
          </>
        )}
      </div>

      {/* Social Counts */}
      {(post.likes.length > 0 || post.comments.length > 0) && (
        <div className="px-4 py-2 flex justify-between text-sm text-gray-400">
          <span>{post.likes.length > 0 && `${post.likes.length} Likes`}</span>
          <button onClick={() => onToggleComments(post._id)} className="hover:underline">
            {post.comments.length > 0 && `${post.comments.length} Comments`}
          </button>
        </div>
      )}

      {/* Action Bar */}
      <div className="border-t border-gray-700 mx-4 my-1"></div>
      <div className="px-4 py-1 flex justify-around">
        <button 
          onClick={() => onLike(post._id)}
          disabled={!user}
          className={`flex items-center space-x-2 p-2 rounded-md transition-colors duration-200 w-full justify-center ${isLikedByCurrentUser ? 'text-cyan-400' : 'text-gray-400 hover:bg-gray-700'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isLikedByCurrentUser ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 18.331v-11h2.066a2 2 0 011.789 1.106l.823 2.468zM7 9V5a2 2 0 012-2h2a2 2 0 012 2v4z" /></svg>
          <span>Like</span>
        </button>
        <button 
          onClick={() => onToggleComments(post._id)}
          className="flex items-center space-x-2 p-2 rounded-md text-gray-400 hover:bg-gray-700 transition-colors duration-200 w-full justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          <span>Comment</span>
        </button>
      </div>

      {isCommentsOpen && <div className="p-4"><CommentSection postId={post._id} onCommentAdded={onCommentAdded} /></div>}
    </div>
  );
};

export default PostItem;
