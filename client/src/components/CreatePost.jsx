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
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg p-6 mb-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <img
              src={getProfileImageUrl(user.profileImageUrl, user.username)}
              alt="User"
              className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-100 shadow-lg"
              onError={(e) => {
                e.target.src = `https://placehold.co/56x56/60a5fa/fff?text=${user.username.charAt(0)}`;
              }}
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
              <i className="fas fa-plus text-white text-xs"></i>
            </div>
          </div>
          <div className="flex-1">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full text-left bg-gradient-to-r from-gray-50 to-gray-100/80 hover:from-blue-50 hover:to-indigo-50 text-gray-600 hover:text-gray-800 px-6 py-4 rounded-2xl border border-gray-200/50 hover:border-blue-200 transition-all duration-200 shadow-sm hover:shadow-md backdrop-blur-sm"
            >
              <span className="text-base">What's on your mind, {user.username}?</span>
              <div className="text-sm text-gray-500 mt-1">Share your thoughts, projects, or ask questions...</div>
            </button>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-between pt-4 border-t border-gray-100/50">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-3 text-gray-600 hover:text-blue-600 font-medium py-3 px-4 rounded-xl hover:bg-blue-50 transition-all duration-200 flex-1 justify-center group"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <i className="fas fa-code text-white text-sm" />
            </div>
            <span className="hidden sm:block">Code Snippet</span>
            <span className="sm:hidden">Code</span>
          </button>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-3 text-gray-600 hover:text-green-600 font-medium py-3 px-4 rounded-xl hover:bg-green-50 transition-all duration-200 flex-1 justify-center group"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <i className="fas fa-image text-white text-sm" />
            </div>
            <span className="hidden sm:block">Photo</span>
            <span className="sm:hidden">Photo</span>
          </button>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-3 text-gray-600 hover:text-purple-600 font-medium py-3 px-4 rounded-xl hover:bg-purple-50 transition-all duration-200 flex-1 justify-center group"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <i className="fas fa-project-diagram text-white text-sm" />
            </div>
            <span className="hidden sm:block">Project</span>
            <span className="sm:hidden">Project</span>
          </button>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-3 text-gray-600 hover:text-orange-600 font-medium py-3 px-4 rounded-xl hover:bg-orange-50 transition-all duration-200 flex-1 justify-center group"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <i className="fas fa-question-circle text-white text-sm" />
            </div>
            <span className="hidden sm:block">Question</span>
            <span className="sm:hidden">Ask</span>
          </button>
        </div>
        
        {/* Quick stats or tips */}
        <div className="mt-4 pt-4 border-t border-gray-100/50">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <i className="fas fa-eye"></i>
                <span>Your posts reach avg. 24 developers</span>
              </span>
            </div>
            <div className="flex items-center gap-1">
              <i className="fas fa-lightbulb text-yellow-500"></i>
              <span>Tip: Add code snippets for higher engagement</span>
            </div>
          </div>
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