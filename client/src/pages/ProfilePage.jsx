import React, { useState, useEffect, useCallback } from 'react';
import DirectMessage from '../components/DirectMessage';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import PostItem from '../components/PostItem';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import GitHubCard from '../components/GitHubCard';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Direct Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-transparent rounded-xl shadow-lg p-2 relative w-full max-w-2xl">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg z-10"
              onClick={() => setShowMessageModal(false)}
            >
              &times;
            </button>
            <DirectMessage currentUserId={currentUser._id} otherUserId={profile._id} otherUserName={profile.username} />
          </div>
        </div>
      )}
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10"></div>
        <div className="absolute inset-0">
          <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="hero-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 40L40 0H20L0 20M40 40V20L20 40" stroke="#e5e7eb" strokeWidth="0.5" fill="none" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-pattern)"/>
          </svg>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <img 
                src={getProfileImageUrl(profile.profileImageUrl, profile.username)}
                alt={`${profile.username}'s profile`}
                className="w-40 h-40 rounded-full ring-6 ring-white/50 shadow-2xl object-cover mx-auto"
              />
              {isOwnProfile && (
                <Link 
                  to="/profile/edit"
                  className="absolute -bottom-2 -right-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white p-3 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 hover:rotate-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </Link>
              )}
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mt-6 mb-4">
              {profile.username}
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6 leading-relaxed">
              {profile.bio || 'Professional Developer & Tech Enthusiast'}
            </p>
            
            {/* Professional Stats Bar */}
            <div className="flex justify-center items-center space-x-8 mb-8">
              <div className="text-center group">
                <div className="text-3xl font-bold text-gray-900 group-hover:text-cyan-600 transition-colors duration-200">{posts.length}</div>
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Posts</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="text-center group">
                <div className="text-3xl font-bold text-gray-900 group-hover:text-cyan-600 transition-colors duration-200">{profile.followers.length}</div>
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Followers</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="text-center group">
                <div className="text-3xl font-bold text-gray-900 group-hover:text-cyan-600 transition-colors duration-200">{profile.following.length}</div>
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Following</div>
              </div>
              {profile.githubStats && (
                <>
                  <div className="w-px h-12 bg-gray-300"></div>
                  <div className="text-center group">
                    <div className="text-3xl font-bold text-gray-900 group-hover:text-yellow-500 transition-colors duration-200">{profile.githubStats.totalStars || 0}</div>
                    <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">GitHub Stars</div>
                  </div>
                </>
              )}
            </div>
            
            {/* Skills */}
            {profile.skills && profile.skills.length > 0 && (
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {profile.skills.slice(0, 8).map((skill, index) => (
                  <span key={index} className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-cyan-200 text-cyan-800 rounded-full text-sm font-semibold hover:bg-cyan-50 hover:border-cyan-300 transition-all duration-200 shadow-sm">
                    {skill}
                  </span>
                ))}
                {profile.skills.length > 8 && (
                  <span className="px-4 py-2 bg-gray-100/80 backdrop-blur-sm border border-gray-300 text-gray-600 rounded-full text-sm font-semibold">
                    +{profile.skills.length - 8} more
                  </span>
                )}
              </div>
            )}
            
            {/* Action Buttons */}
            {!isOwnProfile && currentUser && (
              <div className="flex justify-center gap-4">
                <button 
                  onClick={handleFollow}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 ${
                    isFollowing 
                      ? 'bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50' 
                      : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <i className="fas fa-user-check mr-2"></i>
                      Following
                    </>
                  ) : (
                    <>
                      <i className="fas fa-user-plus mr-2"></i>
                      Follow
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowMessageModal(true)}
                  className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300"
                >
                  <i className="fas fa-comment mr-2"></i>
                  Message
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Profile Content - 3/4 width */}
          <div className="lg:col-span-3">
            {/* Coding Activity Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-8 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Developer Activity</h2>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Active Developer</span>
                </div>
              </div>
              
              {/* GitHub Language Stats */}
              {profile.githubStats?.primaryLanguages?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Programming Languages</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {profile.githubStats.primaryLanguages.slice(0, 6).map((lang, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-cyan-300 hover:bg-cyan-50 transition-all duration-200">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-800">{lang.language}</span>
                          <span className="text-sm font-bold text-cyan-600">{lang.percentage}%</span>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-500" 
                            style={{ width: `${lang.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Posts Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
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
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Posts Yet</h3>
                    <p className="text-gray-500">
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

          {/* Right Sidebar - 1/4 width */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* GitHub Card */}
              <GitHubCard user={profile} isOwn={isOwnProfile} />
              
              {/* Developer Achievements Card */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200 shadow-sm p-4 mb-6">
                <div className="flex items-center mb-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mr-2">
                    <i className="fas fa-trophy text-white text-sm"></i>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">Achievements</h3>
                </div>
                <div className="space-y-2">
                  {profile.githubStats?.totalStars > 10 && (
                    <div className="flex items-center text-xs text-purple-700 bg-purple-100/50 rounded-lg p-2">
                      <i className="fas fa-star text-yellow-500 mr-2"></i>
                      <span>Star Collector ({profile.githubStats.totalStars} stars)</span>
                    </div>
                  )}
                  {profile.githubData?.publicRepos > 5 && (
                    <div className="flex items-center text-xs text-indigo-700 bg-indigo-100/50 rounded-lg p-2">
                      <i className="fas fa-code text-blue-500 mr-2"></i>
                      <span>Active Developer ({profile.githubData.publicRepos} repos)</span>
                    </div>
                  )}
                  {profile.followers?.length > 10 && (
                    <div className="flex items-center text-xs text-green-700 bg-green-100/50 rounded-lg p-2">
                      <i className="fas fa-users text-green-500 mr-2"></i>
                      <span>Community Builder ({profile.followers.length} followers)</span>
                    </div>
                  )}
                  {posts.length > 5 && (
                    <div className="flex items-center text-xs text-cyan-700 bg-cyan-100/50 rounded-lg p-2">
                      <i className="fas fa-pen text-cyan-500 mr-2"></i>
                      <span>Content Creator ({posts.length} posts)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Info Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <div className="flex items-center mb-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg flex items-center justify-center mr-2">
                    <i className="fas fa-info-circle text-white text-sm"></i>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">Profile Info</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <i className="fas fa-calendar-alt text-gray-500 mr-2 w-4"></i>
                    <span className="text-gray-600">
                      Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  {profile.githubData?.location && (
                    <div className="flex items-center">
                      <i className="fas fa-map-marker-alt text-gray-500 mr-2 w-4"></i>
                      <span className="text-gray-600">{profile.githubData.location}</span>
                    </div>
                  )}
                  {profile.githubData?.company && (
                    <div className="flex items-center">
                      <i className="fas fa-building text-gray-500 mr-2 w-4"></i>
                      <span className="text-gray-600">{profile.githubData.company}</span>
                    </div>
                  )}
                  {profile.githubData?.blog && (
                    <div className="flex items-center">
                      <i className="fas fa-link text-gray-500 mr-2 w-4"></i>
                      <a href={profile.githubData.blog} target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:text-cyan-700 truncate">
                        {profile.githubData.blog.replace(/https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
