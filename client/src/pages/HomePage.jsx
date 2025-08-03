import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import CreatePostForm from '../components/CreatePostForm';
import PostItem from '../components/PostItem';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';
import { getProfileImageUrl } from '../utils/imageUtils';

const HomePage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCommentPostId, setOpenCommentPostId] = useState(null);
  const [feedType, setFeedType] = useState('following');
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <div className="max-w-4xl mx-auto">
      {/* Create Post Section */}
      {user && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex items-center space-x-4">
            <img 
              src={getProfileImageUrl(user.profileImageUrl, user.username)} 
              alt="Your profile" 
              className="w-12 h-12 rounded-full ring-2 ring-cyan-500/20 object-cover"
            />
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex-grow bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-left text-gray-500 dark:text-gray-400 px-6 py-4 rounded-xl transition-all duration-200 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            >
              <span className="text-lg">Share your thoughts, code, or discoveries...</span>
            </button>
          </div>
        </div>
      )}

      <CreatePostForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onPostCreated={handlePostCreated} 
      />
      
      {/* Feed Type Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-1 mb-8">
        <div className="flex">
          <button 
            onClick={() => setFeedType('following')}
            className={`flex-1 py-3 px-6 font-semibold text-sm rounded-xl transition-all duration-200 ${
              feedType === 'following' 
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Following
          </button>
          <button 
            onClick={() => setFeedType('global')}
            className={`flex-1 py-3 px-6 font-semibold text-sm rounded-xl transition-all duration-200 ${
              feedType === 'global' 
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Discover
          </button>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner />
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {feedType === 'following' ? "No posts from people you follow" : "No posts yet"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {feedType === 'following' 
                ? "Start following other developers or encourage them to share their thoughts!" 
                : "Be the first to share your thoughts, code, or discoveries with the community!"
              }
            </p>
          </div>
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
