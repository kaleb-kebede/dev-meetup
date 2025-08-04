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
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Banner */}
      <div className="h-16 bg-gradient-to-r from-blue-400 to-cyan-400" />
      {/* Profile Image */}
      <div className="flex flex-col items-center -mt-9 pb-4">
        <img
          src={getProfileImageUrl(user.profileImageUrl, user.username)}
          alt="Profile"
          className="w-18 h-18 rounded-full border-4 border-white shadow-lg object-cover"
          onError={(e) => {
            e.target.src = `https://placehold.co/72x72/60a5fa/fff?text=${user.username.charAt(0)}`;
          }}
        />
        <div className="mt-2 text-center">
          <div className="font-bold text-lg">{user.username}</div>
          <div className="text-sm text-gray-500">{user.bio || 'Software Developer'}</div>
        </div>
      </div>
      {/* Stats */}
      <div className="border-t border-gray-200 px-4 py-2 text-sm">
        <div className="flex justify-between py-1">
          <span className="text-gray-600">Profile viewers</span>
          <span className="font-semibold text-blue-700">16</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-gray-600">Post impressions</span>
          <span className="font-semibold text-blue-700">3</span>
        </div>
      </div>
    </div>
  );
}