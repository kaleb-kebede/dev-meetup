import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import DirectMessage from '../components/DirectMessage';
import { useAuth } from '../context/AuthContext';
import { getProfileImageUrl } from '../utils/imageUtils';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState(null);
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);

    const delayDebounceFn = setTimeout(() => {
      const search = async () => {
        try {
          const response = await api.get(`/users/search?q=${query}`);
          setResults(response.data);
        } catch (error) {
          console.error('Failed to search users:', error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      };
      search();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSearchChange = (e) => {
    const newQuery = e.target.value;
    if (newQuery.trim()) {
      setSearchParams({ q: newQuery });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      {/* --- THEME UPDATE --- */}
      <h1 className="text-4xl font-bold text-cyan-500 dark:text-cyan-400 mb-6">Search Developers</h1>
      
      <div className="mb-8">
        <input
          type="text"
          value={query}
          onChange={handleSearchChange}
          placeholder="Search by username..."
          className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400"
        />
      </div>

      <div>
        {loading && <p className="text-gray-500 dark:text-gray-400">Searching...</p>}
        {!loading && results.length === 0 && query.length > 0 && (
          <p className="text-gray-500 dark:text-gray-400">No users found.</p>
        )}
        <div className="space-y-4">
          {results.map(user => (
            <div key={user._id} className="bg-white dark:bg-gray-800 p-4 rounded-lg flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 shadow">
              <div className="flex items-center">
                <img 
                  src={getProfileImageUrl(user.profileImageUrl, user.username)}
                  alt={user.username}
                  className="w-10 h-10 rounded-full mr-4 object-cover"
                  onError={(e) => {
                    e.target.src = `https://placehold.co/40x40/E2E8F0/475569?text=${user.username.charAt(0)}`;
                  }}
                />
                <Link to={`/profile/${user.username}`} className="font-bold text-lg text-gray-800 dark:text-gray-200">
                  {user.username}
                </Link>
              </div>
              {currentUser && currentUser._id !== user._id && (
                <button
                  className="ml-4 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-semibold shadow hover:scale-105 transition-all duration-200"
                  onClick={() => { 
                    setSelectedUserId(user._id); 
                    setSelectedUserName(user.username);
                    setShowMessageModal(true); 
                  }}
                >
                  Message
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
             {/* Direct Message Modal */}
       {showMessageModal && selectedUserId && (
         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
           <div className="bg-transparent rounded-xl shadow-lg p-2 relative w-full max-w-2xl">
             <button
               className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white bg-white dark:bg-gray-800 rounded-full w-8 h-8 flex items-center justify-center shadow-lg z-10"
               onClick={() => setShowMessageModal(false)}
             >
               &times;
             </button>
             <DirectMessage currentUserId={currentUser._id} otherUserId={selectedUserId} otherUserName={selectedUserName} />
           </div>
         </div>
       )}
    </div>
  );
};

export default SearchPage;
