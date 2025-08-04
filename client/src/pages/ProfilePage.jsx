import React, { useState, useEffect, useCallback } from 'react';
import DirectMessage from '../components/DirectMessage';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import PostItem from '../components/PostItem';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import { getProfileImageUrl } from '../utils/imageUtils';

const ProfilePage = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();

  const [profileData, setProfileData] = useState({ profile: null, posts: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);

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
  }, [fetchProfileData, currentUser]);

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
  
  const dummyHandler = () => {};

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">User Not Found</h3>
          <p className="text-gray-500 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }
  
  if (!profileData.profile) return null;

  const { profile, posts } = profileData;
  const isFollowing = currentUser && profile.followers.includes(currentUser._id);
  const isOwnProfile = currentUser && currentUser._id === profile._id;

  return (
    <div className="max-w-4xl mx-auto">
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
             <DirectMessage currentUserId={currentUser._id} otherUserId={profile._id} otherUserName={profile.username} />
           </div>
         </div>
       )}
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          {/* Profile Image */}
          <div className="relative">
            <img 
              src={getProfileImageUrl(profile.profileImageUrl, profile.username)}
              alt={`${profile.username}'s profile`}
              className="w-32 h-32 rounded-full ring-4 ring-cyan-500/20 shadow-lg object-cover"
            />
            {isOwnProfile && (
              <Link 
                to="/profile/edit"
                className="absolute -bottom-2 -right-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white p-2 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </Link>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {profile.username}
            </h1>
            
            {/* Stats */}
            <div className="flex justify-center md:justify-start space-x-6 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{posts.length}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{profile.followers.length}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{profile.following.length}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Following</div>
              </div>
            </div>

            {/* Bio */}
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              {profile.bio || 'No bio yet.'}
            </p>
          </div>

          {/* Action Buttons */}
          {!isOwnProfile && currentUser && (
            <div className="flex flex-col gap-2">
              <button 
                onClick={handleFollow}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 ${
                  isFollowing 
                    ? 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-white' 
                    : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white'
                }`}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
              <button
                onClick={() => setShowMessageModal(true)}
                className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Message
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Posts Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Posts by {profile.username}
          </h2>
        </div>

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
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Posts Yet</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {isOwnProfile 
                  ? "You haven't shared anything yet. Start by creating your first post!" 
                  : "This user hasn't posted anything yet."
                }
              </p>
              {isOwnProfile && (
                <Link 
                  to="/"
                  className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Create Your First Post
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
