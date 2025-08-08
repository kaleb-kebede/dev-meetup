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
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        {/* Header with Terminal-like styling */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <img
              src={getProfileImageUrl(user.profileImageUrl, user.username)}
              alt="User"
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
              onError={(e) => {
                e.target.src = `https://placehold.co/48x48/374151/fff?text=${user.username.charAt(0)}`;
              }}
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <i className="fas fa-plus text-white text-xs"></i>
            </div>
          </div>
          <div className="flex-1">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full text-left bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-800 px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 font-mono text-sm"
            >
              <span className="text-gray-400 mr-2">$</span>
              <span>echo "What's on your mind, {user.username}?"</span>
              <div className="text-xs text-gray-500 mt-1 ml-4">// Share code, insights, or ask the community</div>
            </button>
          </div>
        </div>
        
        {/* Developer Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
          >
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <i className="fas fa-code text-white"></i>
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">Code</span>
            <span className="text-xs text-gray-500">Share snippets</span>
          </button>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200 group"
          >
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <i className="fas fa-folder-open text-white"></i>
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-green-600">Project</span>
            <span className="text-xs text-gray-500">Showcase work</span>
          </button>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 group"
          >
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <i className="fas fa-question-circle text-white"></i>
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-purple-600">Question</span>
            <span className="text-xs text-gray-500">Ask community</span>
          </button>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 group"
          >
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <i className="fas fa-image text-white"></i>
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600">Media</span>
            <span className="text-xs text-gray-500">Add images</span>
          </button>
        </div>
        
        {/* Developer Stats Bar */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="font-mono">24 developers online</span>
            </div>
            <div className="flex items-center gap-1">
              <i className="fas fa-eye text-gray-400"></i>
              <span>avg. reach: 47 devs</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-amber-600">
            <i className="fas fa-lightbulb"></i>
            <span className="font-mono">tip: code snippets boost engagement by 85%</span>
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