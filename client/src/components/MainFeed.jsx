import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import CreatePost from './CreatePost';
import PostItem from './PostItem';
import PostSkeleton from './PostSkeleton';
import { useAuth } from '../context/AuthContext';

export default function MainFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if user is authenticated
      if (!user) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      console.log('Fetching posts...');
      const response = await api.get('/posts');
      console.log('Posts response:', response.data);
      setPosts(response.data);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      
      if (err.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else if (err.response?.status === 404) {
        setError('Posts endpoint not found. Please check the server.');
      } else if (err.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else {
        setError(err.response?.data?.message || 'Failed to load posts');
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPosts();
    
    // Set up polling for real-time updates every 30 seconds
    const interval = setInterval(() => {
      if (user) {
        fetchPosts();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchPosts, user]);

  const handlePostCreated = () => {
    fetchPosts(); // Refresh posts when a new one is created
  };

  const handleLike = async (postId) => {
    try {
      // Optimistic update
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId 
            ? { 
                ...post, 
                likes: post.likes.includes(user._id) 
                  ? post.likes.filter(id => id !== user._id)
                  : [...post.likes, user._id]
              }
            : post
        )
      );

      const response = await api.patch(`/posts/${postId}`);
      const updatedPost = response.data;
      setPosts(posts.map(post => 
        post._id === postId ? { ...post, likes: updatedPost.likes } : post
      ));
    } catch (error) {
      console.error('Failed to like post:', error);
      // Revert optimistic update on error
      fetchPosts();
    }
  };

  const handleDelete = async (postId) => {
    try {
      // Optimistic update
      setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
      
      await api.delete(`/posts/${postId}`);
    } catch (error) {
      console.error('Failed to delete post:', error);
      // Revert optimistic update on error
      fetchPosts();
    }
  };

  const handleUpdate = async (postId, updatedData) => {
    try {
      const response = await api.put(`/posts/${postId}`, updatedData);
      const updatedPost = response.data;
      setPosts(posts.map(post => 
        post._id === postId ? updatedPost : post
      ));
    } catch (error) {
      console.error('Failed to update post:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <CreatePost onPostCreated={handlePostCreated} />
        {/* Show skeleton loading */}
        {[1, 2, 3].map((i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <CreatePost onPostCreated={handlePostCreated} />
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
          <div className="text-red-500 mb-2">
            <i className="fas fa-exclamation-triangle text-2xl mb-4"></i>
          </div>
          <p className="text-gray-700 font-medium mb-2">Error Loading Posts</p>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <button 
            onClick={fetchPosts}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <CreatePost onPostCreated={handlePostCreated} />
      {posts.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
          <div className="text-gray-400 mb-4">
            <i className="fas fa-newspaper text-4xl"></i>
          </div>
          <p className="text-gray-500 font-medium mb-2">No posts yet</p>
          <p className="text-gray-400 text-sm">Be the first to share your thoughts!</p>
        </div>
      ) : (
        posts.map(post => (
          <PostItem 
            key={post._id} 
            post={post} 
            onLike={handleLike}
            onCommentAdded={() => fetchPosts()}
            onToggleComments={() => {}}
            isCommentsOpen={false}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        ))
      )}
    </div>
  );
}