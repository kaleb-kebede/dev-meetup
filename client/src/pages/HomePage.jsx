import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import CreatePostForm from '../components/CreatePostForm';
import PostItem from '../components/PostItem';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCommentPostId, setOpenCommentPostId] = useState(null);
  // 1. New state to track the current feed type ('following' or 'global')
  const [feedType, setFeedType] = useState('following');

  // 2. Update fetchPosts to get data based on the selected feed type
  const fetchPosts = useCallback(async () => {
    const url = feedType === 'following' ? '/posts/feed' : '/posts';
    try {
      const response = await api.get(url);
      setPosts(response.data);
    } catch (error) {
      console.error(`Failed to fetch ${feedType} feed:`, error);
    }
  }, [feedType]); // Rerun this function if feedType changes

  useEffect(() => {
    const initialFetch = async () => {
      setLoading(true);
      await fetchPosts();
      setLoading(false);
    };
    initialFetch();
  }, [fetchPosts]); // Rerun when fetchPosts function updates (i.e., when feedType changes)

  const handlePostCreated = (newPost) => {
    fetchPosts();
  };

  const handleLike = async (postId) => {
    try {
      const response = await api.put(`/posts/${postId}/like`);
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

  return (
    <div className="container mx-auto p-4 md:p-8">
      {user && <CreatePostForm onPostCreated={handlePostCreated} />}
      
      {/* 3. Feed Toggle UI */}
      <div className="mt-8 mb-4 flex border-b-2 border-gray-700">
        <button 
          onClick={() => setFeedType('following')}
          className={`py-2 px-4 font-semibold transition-colors duration-200 ${feedType === 'following' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-white'}`}
        >
          Following
        </button>
        <button 
          onClick={() => setFeedType('global')}
          className={`py-2 px-4 font-semibold transition-colors duration-200 ${feedType === 'global' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400 hover:text-white'}`}
        >
          Discover
        </button>
      </div>

      <div className="space-y-6">
        {loading ? (
          <p className="text-gray-400">Loading feed...</p>
        ) : posts.length === 0 ? (
          <p className="text-gray-400">
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
            />
          ))
        )}
      </div>
    </div>
  );
};

export default HomePage;
