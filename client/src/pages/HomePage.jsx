import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import CreatePostForm from '../components/CreatePostForm';
import PostItem from '../components/PostItem';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCommentPostId, setOpenCommentPostId] = useState(null);
  const [feedType, setFeedType] = useState('following');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const getFullImageUrl = (path) => {
    if (!path) return null;
    return `${API_BASE_URL.replace('/api', '')}${path}`;
  };

  const fetchPosts = useCallback(async () => {
    const url = feedType === 'following' ? '/posts/feed' : '/posts';
    try {
      const response = await api.get(url);
      setPosts(response.data);
    } catch (error) {
      console.error(`Failed to fetch ${feedType} feed:`, error);
    }
  }, [feedType]);

  useEffect(() => {
    const initialFetch = async () => {
      setLoading(true);
      await fetchPosts();
      setLoading(false);
    };
    initialFetch();
  }, [fetchPosts]);

  const handlePostCreated = (newPost) => {
    fetchPosts();
  };

  const handleLike = async (postId) => {
    try {
      const response = await api.patch(`/posts/${postId}`);
      const updatedPost = response.data;
      setPosts(posts.map(post => 
        post._id === postId ? { ...post, likes: updatedPost.likes } : post
      ));
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleCommentAdded = (postId) => {
    fetchPosts();
  };

  const handleToggleComments = (postId) => {
    setOpenCommentPostId(prevId => (prevId === postId ? null : postId));
  };

  const handleDelete = async (postId) => {
    try {
      await api.delete(`/posts/${postId}`);
      setPosts(posts.filter(post => post._id !== postId));
      toast.success('Post deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete post.');
    }
  };

  const handleUpdate = async (postId, updatedData) => {
    try {
      const response = await api.put(`/posts/${postId}`, updatedData);
      const updatedPost = response.data;
      setPosts(posts.map(post => 
        post._id === postId ? updatedPost : post
      ));
      toast.success('Post updated successfully!');
    } catch (error) {
      toast.error('Failed to update post.');
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      {user && (
        // --- THEME UPDATE ---
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg mb-8 flex items-center space-x-4">
          <img 
            src={getFullImageUrl(user.profileImageUrl) || `https://placehold.co/48x48/1f2937/9ca3af?text=${user.username.charAt(0)}`} 
            alt="Your profile" 
            className="w-12 h-12 rounded-full"
          />
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-grow bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-left text-gray-500 dark:text-gray-400 px-4 py-3 rounded-full transition-colors duration-200"
          >
            Start a post...
          </button>
        </div>
      )}

      <CreatePostForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onPostCreated={handlePostCreated} 
      />
      
      {/* --- THEME UPDATE --- */}
      <div className="mt-8 mb-4 flex border-b-2 border-gray-200 dark:border-gray-700">
        <button 
          onClick={() => setFeedType('following')}
          className={`py-2 px-4 font-semibold transition-colors duration-200 ${feedType === 'following' ? 'text-cyan-500 dark:text-cyan-400 border-b-2 border-cyan-500 dark:border-cyan-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
        >
          Following
        </button>
        <button 
          onClick={() => setFeedType('global')}
          className={`py-2 px-4 font-semibold transition-colors duration-200 ${feedType === 'global' ? 'text-cyan-500 dark:text-cyan-400 border-b-2 border-cyan-500 dark:border-cyan-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
        >
          Discover
        </button>
      </div>

      <div className="space-y-6">
        {loading ? (
          <Spinner />
        ) : posts.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            {feedType === 'following' ? "You're not following anyone yet, or they haven't posted." : "No posts yet. Be the first to share!"}
          </p>
        ) : (
          posts.map((post) => (
            <PostItem 
              key={post._id} 
              post={post} 
              onLike={handleLike}
              onCommentAdded={() => handleCommentAdded(post._id)}
              onToggleComments={handleToggleComments}
              isCommentsOpen={openCommentPostId === post._id}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default HomePage;
