import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import CreatePost from './CreatePost';
import PostItem from './PostItem';
import PostSkeleton from './PostSkeleton';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function MainFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openCommentPostId, setOpenCommentPostId] = useState(null);
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

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

  const handleToggleComments = (postId) => {
    setOpenCommentPostId(prevId => (prevId === postId ? null : postId));
  };

  const handleCommentAdded = (postId) => {
    fetchPosts(); // Refresh posts to get updated comment count
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
    <div className="space-y-6">
      {/* Trending Topics Bar */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <i className="fas fa-fire text-lg"></i>
            </div>
            <h3 className="text-lg font-bold">Trending in Dev Community</h3>
          </div>
          <div className="flex items-center space-x-2 text-sm text-white/80">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <span>Live updates</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { tag: '#React19', posts: 234, trend: '+15%' },
            { tag: '#TypeScript', posts: 189, trend: '+8%' },
            { tag: '#NextJS', posts: 156, trend: '+22%' },
            { tag: '#OpenSource', posts: 98, trend: '+12%' }
          ].map((topic, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition-all duration-200 cursor-pointer group">
              <div className="text-sm font-semibold group-hover:text-yellow-300 transition-colors">{topic.tag}</div>
              <div className="text-xs text-white/80">{topic.posts} posts</div>
              <div className="text-xs text-green-300 font-medium">{topic.trend}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Developers Section */}
      <div className={`backdrop-blur-sm rounded-2xl border shadow-lg p-6 ${
        isDarkMode
          ? 'bg-gray-800/80 border-gray-600'
          : 'bg-white/80 border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
              <i className="fas fa-crown text-white text-sm"></i>
            </div>
            <h3 className={`text-lg font-bold ${
              isDarkMode ? 'text-gray-100' : 'text-gray-900'
            }`}>Featured Developers</h3>
          </div>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
            View all
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              name: "Sarah Chen",
              username: "@sarahdev",
              specialty: "React & TypeScript",
              followers: "2.3k",
              avatar: "SC",
              verified: true,
              recentActivity: "Published: Advanced React Patterns"
            },
            {
              name: "Alex Rodriguez",
              username: "@alexcodes",
              specialty: "Full Stack & DevOps",
              followers: "1.8k",
              avatar: "AR",
              verified: true,
              recentActivity: "Launched: Open-source CI/CD tool"
            }
          ].map((dev, index) => (
            <div key={index} className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer group">
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                    {dev.avatar}
                  </div>
                  {dev.verified && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <i className="fas fa-check text-white text-xs"></i>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{dev.name}</h4>
                  </div>
                  <p className="text-sm text-gray-600">{dev.username}</p>
                  <p className="text-xs text-gray-500 mt-1">{dev.specialty}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-blue-600 font-medium">{dev.followers} followers</span>
                    <button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-full transition-colors">
                      Follow
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 mt-2 italic">{dev.recentActivity}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Post Component */}
      <CreatePost onPostCreated={handlePostCreated} />
      
      {/* Posts Feed with Enhanced Stats */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Developer Feed</span>
              </div>
              <div className="text-sm text-gray-500">•</div>
              <span className="text-sm text-blue-600 font-mono">{posts.length} active threads</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <i className="fas fa-eye"></i>
                <span>Real-time updates</span>
              </div>
              <button className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors">
                <i className="fas fa-filter text-sm"></i>
              </button>
            </div>
          </div>
        </div>
        
        <div className="divide-y divide-gray-100">
          {posts.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-code text-2xl text-gray-400"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to code together?</h3>
              <p className="text-gray-500 mb-4">Share your projects, ask questions, or help fellow developers</p>
              <div className="flex justify-center space-x-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  <i className="fas fa-code mr-1"></i>Code Sharing
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  <i className="fas fa-question-circle mr-1"></i>Q&A
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  <i className="fas fa-lightbulb mr-1"></i>Tips & Tricks
                </span>
              </div>
            </div>
          ) : (
            posts.map(post => (
              <div key={post._id} className="p-6">
                <PostItem 
                  post={post} 
                  onLike={handleLike}
                  onCommentAdded={() => handleCommentAdded(post._id)}
                  onToggleComments={handleToggleComments}
                  isCommentsOpen={openCommentPostId === post._id}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}