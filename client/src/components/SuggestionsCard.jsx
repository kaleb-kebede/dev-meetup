import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getProfileImageUrl } from '../utils/imageUtils';

export default function SuggestionsCard() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch users from the database
      const response = await api.get('/users');
      const allUsers = response.data;
      
      // Filter out the current user and get random users
      const otherUsers = allUsers.filter(user => user._id !== currentUser?._id);
      
      // Get random 3-5 users for suggestions
      const shuffled = otherUsers.sort(() => 0.5 - Math.random());
      const selectedUsers = shuffled.slice(0, Math.min(4, otherUsers.length));
      
      // Transform users into suggestion format
      const userSuggestions = selectedUsers.map(user => ({
        id: user._id,
        name: user.username,
        desc: user.bio || 'Software Developer',
        avatar: getProfileImageUrl(user.profileImageUrl, user.username),
        isFollowing: false // You can implement following logic later
      }));
      
      setSuggestions(userSuggestions);
    } catch (err) {
      console.error('Failed to fetch suggestions:', err);
      setError('Failed to load suggestions');
      // Fallback to empty array
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId, userName) => {
    try {
      // Here you would implement the follow functionality
      // For now, just show a toast notification
      console.log(`Following user: ${userName} (${userId})`);
      // You can add actual follow API call here
      // await api.post(`/users/${userId}/follow`);
    } catch (error) {
      console.error('Failed to follow user:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="font-semibold text-gray-800">Add to your feed</div>
          <i className="fas fa-info-circle text-gray-400" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-1">
                <div className="h-3 bg-gray-200 rounded w-24"></div>
                <div className="h-2 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="font-semibold text-gray-800">Add to your feed</div>
          <i className="fas fa-info-circle text-gray-400" />
        </div>
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm">{error}</p>
          <button 
            onClick={fetchSuggestions}
            className="mt-2 text-blue-600 text-sm font-medium hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="font-semibold text-gray-800">Add to your feed</div>
          <i className="fas fa-info-circle text-gray-400" />
        </div>
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm">No suggestions available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold text-gray-800">Add to your feed</div>
        <i className="fas fa-info-circle text-gray-400" />
      </div>
      <div className="space-y-3">
        {suggestions.map((suggestion) => (
          <div key={suggestion.id} className="flex items-center gap-3">
            <img 
              src={suggestion.avatar} 
              alt={suggestion.name} 
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                e.target.src = `https://placehold.co/40x40/60a5fa/fff?text=${suggestion.name.charAt(0)}`;
              }}
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900 text-sm">{suggestion.name}</div>
              <div className="text-xs text-gray-500">{suggestion.desc}</div>
            </div>
            <button 
              onClick={() => handleFollow(suggestion.id, suggestion.name)}
              className="border border-blue-600 text-blue-600 rounded-full px-3 py-1 text-xs font-semibold hover:bg-blue-50 transition-colors duration-200"
            >
              + Follow
            </button>
          </div>
        ))}
      </div>
      <div className="pt-3 mt-2 border-t border-gray-100 text-center">
        <button 
          onClick={fetchSuggestions}
          className="text-blue-600 text-sm font-medium hover:underline"
        >
          Refresh suggestions
        </button>
      </div>
    </div>
  );
}