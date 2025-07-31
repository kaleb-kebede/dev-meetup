import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import PostItem from '../components/PostItem';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

const ProfilePage = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();

  const [profileData, setProfileData] = useState({ profile: null, posts: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const getFullImageUrl = (path) => {
    if (!path) return null;
    return `${API_BASE_URL.replace('/api', '')}${path}`;
  };

  const fetchProfileData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/users/${username}`);
      setProfileData(response.data);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError('User not found.');
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData, currentUser]); // Refetch when currentUser changes

  const handleFollow = async () => {
    try {
      await api.put(`/users/${profileData.profile._id}/follow`);
      setProfileData(prevData => {
        const isFollowing = prevData.profile.followers.includes(currentUser._id);
        const newFollowers = isFollowing
          ? prevData.profile.followers.filter(id => id !== currentUser._id)
          : [...prevData.profile.followers, currentUser._id];
        return {
          ...prevData,
          profile: { ...prevData.profile, followers: newFollowers },
        };
      });
    } catch (err) {
      console.error('Failed to follow user:', err);
    }
  };
  
  // Create dummy handlers for PostItem since they are not connected on this page
  const dummyHandler = () => {};

  if (loading) return <Spinner />;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!profileData.profile) return null;

  const { profile, posts } = profileData;
  const isFollowing = currentUser && profile.followers.includes(currentUser._id);
  const isOwnProfile = currentUser && currentUser._id === profile._id;

  return (
    <div className="container mx-auto p-4 md:p-8">
      {/* --- THEME UPDATE --- */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8 flex flex-col md:flex-row items-center">
        <img 
          src={getFullImageUrl(profile.profileImageUrl) || `https://placehold.co/100x100/E2E8F0/475569?text=${profile.username.charAt(0)}`}
          alt={`${profile.username}'s profile`}
          className="w-24 h-24 rounded-full mr-0 md:mr-6 mb-4 md:mb-0 border-4 border-cyan-500 dark:border-cyan-400"
        />
        <div className="flex-grow text-center md:text-left">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{profile.username}</h1>
          <div className="flex justify-center md:justify-start space-x-4 mt-2 text-gray-500 dark:text-gray-400">
            <span>{posts.length} Posts</span>
            <span>{profile.followers.length} Followers</span>
            <span>{profile.following.length} Following</span>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mt-4">{profile.bio || 'No bio yet.'}</p>
        </div>
        {isOwnProfile ? (
          <Link 
            to="/profile/edit"
            className="mt-4 md:mt-0 px-6 py-2 rounded-lg font-bold transition duration-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
          >
            Edit Profile
          </Link>
        ) : currentUser && (
          <button 
            onClick={handleFollow}
            className={`mt-4 md:mt-0 px-6 py-2 rounded-lg font-bold transition duration-300 ${isFollowing ? 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-white' : 'bg-cyan-500 hover:bg-cyan-600 text-white'}`}
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        )}
      </div>

      <div>
        <h2 className="text-3xl font-bold text-cyan-500 dark:text-cyan-400 border-b-2 border-gray-200 dark:border-gray-700 pb-2 mb-6">
          Posts by {profile.username}
        </h2>
        <div className="space-y-6">
          {posts.length > 0 ? (
            posts.map(post => (
              <PostItem 
                key={post._id} 
                post={post} 
                onLike={dummyHandler} 
                onCommentAdded={dummyHandler}
                onToggleComments={dummyHandler}
                isCommentsOpen={false}
                onDelete={dummyHandler}
                onUpdate={dummyHandler}
              />
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">This user hasn't posted anything yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
