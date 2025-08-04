import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import CreatePostForm from './CreatePostForm';
import { getProfileImageUrl } from '../utils/imageUtils';

export default function CreatePost({ onPostCreated }) {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!user) {
    return null;
  }

  const handlePostCreated = () => {
    setIsModalOpen(false);
    if (onPostCreated) {
      onPostCreated();
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-2">
        {/* Top: Avatar and input */}
        <div className="flex items-center gap-3 mb-3">
          <img
            src={getProfileImageUrl(user.profileImageUrl, user.username)}
            alt="User"
            className="w-12 h-12 rounded-full object-cover"
            onError={(e) => {
              e.target.src = `https://placehold.co/48x48/60a5fa/fff?text=${user.username.charAt(0)}`;
            }}
          />
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 text-left bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-full border border-gray-200 transition"
          >
            Start a post
          </button>
        </div>
        {/* Bottom: Action buttons */}
        <div className="flex justify-around pt-2 border-t border-gray-100">
          <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium py-2">
            <i className="fas fa-video text-lg text-green-500" /> Video
          </button>
          <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium py-2">
            <i className="fas fa-image text-lg text-blue-400" /> Photo
          </button>
          <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium py-2">
            <i className="fas fa-edit text-lg text-orange-400" /> Write article
          </button>
        </div>
      </div>

      <CreatePostForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onPostCreated={handlePostCreated} 
      />
    </>
  );
}