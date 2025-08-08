import React from 'react';
import { useAuth } from '../context/AuthContext';
import { getProfileImageUrl } from '../utils/imageUtils';

export default function ProfileCard() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-4 text-center text-gray-500">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 overflow-hidden shadow-lg">
      {/* Banner */}
      <div className="h-20 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute bottom-2 right-3">
          <i className="fas fa-code text-white/30 text-2xl"></i>
        </div>
      </div>
      
      {/* Profile Section */}
      <div className="relative px-4 pb-4">
        {/* Profile Image */}
        <div className="flex justify-center -mt-10">
          <div className="relative">
            <img
              src={getProfileImageUrl(user.profileImageUrl, user.username)}
              alt="Profile"
              className="w-20 h-20 rounded-full border-4 border-white shadow-xl object-cover"
              onError={(e) => {
                e.target.src = `https://placehold.co/80x80/60a5fa/fff?text=${user.username.charAt(0)}`;
              }}
            />
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
        </div>
        
        {/* Profile Info */}
        <div className="mt-3 text-center">
          <h3 className="font-bold text-xl text-gray-900">{user.username}</h3>
          <p className="text-sm text-gray-600 mt-1 leading-relaxed">
            {user.bio || 'Software Developer'}
          </p>
          
          {/* Skills Preview */}
          {user.skills && user.skills.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1 mt-3">
              {user.skills.slice(0, 3).map((skill, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                  {skill}
                </span>
              ))}
              {user.skills.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                  +{user.skills.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="border-t border-gray-100/50 bg-gray-50/30 px-4 py-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <div className="font-bold text-lg text-gray-900">156</div>
            <div className="text-gray-600 text-xs">Profile views</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-gray-900">23</div>
            <div className="text-gray-600 text-xs">Post impressions</div>
          </div>
        </div>
        
        {/* GitHub Stats if connected */}
        {user.githubStats && (
          <div className="mt-3 pt-3 border-t border-gray-200/50">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600 flex items-center">
                <i className="fab fa-github mr-1"></i>
                GitHub Stars
              </span>
              <span className="font-semibold text-blue-600">{user.githubStats.totalStars || 0}</span>
            </div>
          </div>
        )}
        
        {/* View Profile Link */}
        <div className="mt-3 pt-3 border-t border-gray-200/50">
          <a 
            href={`/profile/${user.username}`}
            className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
          >
            View full profile →
          </a>
        </div>
      </div>
    </div>
  );
}