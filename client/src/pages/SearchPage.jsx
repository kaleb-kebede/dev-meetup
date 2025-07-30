import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // This useEffect hook will run whenever the user stops typing for 300ms
  useEffect(() => {
    // If the query is empty, clear the results and do nothing
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);

    // Set up a timer to delay the API call
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
    }, 300); // 300ms delay

    // Cleanup function: this will clear the timer if the user types again
    return () => clearTimeout(delayDebounceFn);
  }, [query]); // Rerun the effect whenever the 'query' state changes

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-bold text-cyan-400 mb-6">Search Developers</h1>
      
      {/* Search Input Bar */}
      <div className="mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by username..."
          className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
      </div>

      {/* Search Results */}
      <div>
        {loading && <p className="text-gray-400">Searching...</p>}
        {!loading && results.length === 0 && query.length > 0 && (
          <p className="text-gray-400">No users found.</p>
        )}
        <div className="space-y-4">
          {results.map(user => (
            <Link 
              to={`/profile/${user.username}`} 
              key={user._id}
              className="bg-gray-800 p-4 rounded-lg flex items-center hover:bg-gray-700 transition-colors duration-200"
            >
              <img 
                src={user.profileImageUrl || `https://placehold.co/40x40/1f2937/9ca3af?text=${user.username.charAt(0)}`}
                alt={user.username}
                className="w-10 h-10 rounded-full mr-4"
              />
              <span className="font-bold text-lg">{user.username}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
