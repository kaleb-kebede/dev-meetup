import React, { useState, useEffect, useMemo } from 'react';
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
  
  // Advanced search filters
  const [searchType, setSearchType] = useState('all'); // 'all', 'developers', 'projects', 'posts'
  const [filters, setFilters] = useState({
    skills: [],
    location: '',
    minGitHubStars: 0,
    minRepos: 0,
    languages: [],
    sortBy: 'relevance' // 'relevance', 'followers', 'github_stars', 'recent'
  });
  const [recommendations, setRecommendations] = useState([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);

  // Popular programming languages for filters
  const popularLanguages = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'React', 'Node.js',
    'Go', 'Rust', 'PHP', 'C++', 'C#', 'Swift', 'Kotlin', 'Vue.js', 'Angular'
  ];

  // Mock recommendation engine based on shared technologies
  const generateRecommendations = useMemo(() => {
    if (!currentUser?.skills) return [];
    // In real app, this would be server-side logic
    return [
      {
        _id: 'rec1',
        username: 'sarah_dev',
        profileImageUrl: null,
        bio: 'Full-stack developer passionate about React and Node.js',
        skills: ['React', 'Node.js', 'TypeScript'],
        githubData: { publicRepos: 23, followers: 156 },
        githubStats: { totalStars: 89 },
        matchPercentage: 95,
        commonSkills: ['React', 'TypeScript']
      },
      {
        _id: 'rec2',
        username: 'code_master',
        profileImageUrl: null,
        bio: 'Backend engineer, loves Python and Go',
        skills: ['Python', 'Go', 'Docker'],
        githubData: { publicRepos: 45, followers: 278 },
        githubStats: { totalStars: 156 },
        matchPercentage: 87,
        commonSkills: ['Python']
      }
    ];
  }, [currentUser]);

  useEffect(() => {
    setRecommendations(generateRecommendations);
  }, [generateRecommendations]);

  // Advanced search with filters
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);

    const delayDebounceFn = setTimeout(() => {
      const search = async () => {
        try {
          // Build query parameters with filters
          const params = new URLSearchParams({
            q: query,
            type: searchType,
            ...Object.entries(filters).reduce((acc, [key, value]) => {
              if (Array.isArray(value) && value.length > 0) {
                acc[key] = value.join(',');
              } else if (value && typeof value !== 'object') {
                acc[key] = value;
              }
              return acc;
            }, {})
          });
          
          const response = await api.get(`/users/search?${params.toString()}`);
          setResults(response.data);
          
          // Add to search history
          if (!searchHistory.includes(query)) {
            setSearchHistory(prev => [query, ...prev.slice(0, 4)]);
          }
        } catch (error) {
          console.error('Failed to search:', error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      };
      search();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, searchType, filters, searchHistory]);

  const handleSearchChange = (e) => {
    const newQuery = e.target.value;
    if (newQuery.trim()) {
      setSearchParams({ q: newQuery });
    } else {
      setSearchParams({});
    }
  };

  const handleSkillToggle = (skill) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleLanguageToggle = (language) => {
    setFilters(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const clearFilters = () => {
    setFilters({
      skills: [],
      location: '',
      minGitHubStars: 0,
      minRepos: 0,
      languages: [],
      sortBy: 'relevance'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Discover Developers
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find developers by skills, location, GitHub activity, and project experience
          </p>
        </div>

        {/* Search Bar with Advanced Features */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400"></i>
              </div>
              <input
                type="text"
                value={query}
                onChange={handleSearchChange}
                placeholder="Search developers by name, skills, or technologies..."
                className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 font-medium"
              />
            </div>
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`px-6 py-4 rounded-xl font-semibold transition-all duration-200 ${
                showAdvancedFilters
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <i className="fas fa-sliders-h mr-2"></i>
              Filters
            </button>
          </div>

          {/* Search Type Tabs */}
          <div className="flex space-x-2 mb-4">
            {[
              { key: 'all', label: 'All', icon: 'fas fa-globe' },
              { key: 'developers', label: 'Developers', icon: 'fas fa-users' },
              { key: 'projects', label: 'Projects', icon: 'fas fa-folder-open' },
              { key: 'posts', label: 'Posts', icon: 'fas fa-file-alt' }
            ].map(type => (
              <button
                key={type.key}
                onClick={() => setSearchType(type.key)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  searchType === type.key
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <i className={`${type.icon} mr-2`}></i>
                {type.label}
              </button>
            ))}
          </div>

          {/* Search History */}
          {searchHistory.length > 0 && !query && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Recent Searches</h4>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchParams({ q: term })}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors duration-200"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Advanced Filters Panel */}
        {showAdvancedFilters && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all filters
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Programming Languages */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  <i className="fas fa-code mr-2 text-blue-500"></i>
                  Programming Languages
                </h4>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {popularLanguages.map(lang => (
                    <button
                      key={lang}
                      onClick={() => handleLanguageToggle(lang)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                        filters.languages.includes(lang)
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skills Filter */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  <i className="fas fa-star mr-2 text-yellow-500"></i>
                  Skills & Technologies
                </h4>
                <input
                  type="text"
                  placeholder="Add skills (press Enter)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      handleSkillToggle(e.target.value.trim());
                      e.target.value = '';
                    }
                  }}
                />
                {filters.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {filters.skills.map(skill => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center"
                      >
                        {skill}
                        <button
                          onClick={() => handleSkillToggle(skill)}
                          className="ml-2 text-green-600 hover:text-green-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Location */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  <i className="fas fa-map-marker-alt mr-2 text-red-500"></i>
                  Location
                </h4>
                <input
                  type="text"
                  placeholder="City, Country"
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* GitHub Stats */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  <i className="fab fa-github mr-2 text-purple-500"></i>
                  GitHub Activity
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Min. Stars: {filters.minGitHubStars}</label>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="10"
                      value={filters.minGitHubStars}
                      onChange={(e) => setFilters(prev => ({ ...prev, minGitHubStars: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Min. Repositories: {filters.minRepos}</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={filters.minRepos}
                      onChange={(e) => setFilters(prev => ({ ...prev, minRepos: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Sort Options */}
              <div className="lg:col-span-2">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  <i className="fas fa-sort mr-2 text-indigo-500"></i>
                  Sort By
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'relevance', label: 'Relevance', icon: 'fas fa-search' },
                    { key: 'followers', label: 'Most Followers', icon: 'fas fa-users' },
                    { key: 'github_stars', label: 'GitHub Stars', icon: 'fas fa-star' },
                    { key: 'recent', label: 'Recently Active', icon: 'fas fa-clock' }
                  ].map(sort => (
                    <button
                      key={sort.key}
                      onClick={() => setFilters(prev => ({ ...prev, sortBy: sort.key }))}
                      className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        filters.sortBy === sort.key
                          ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                          : 'text-gray-600 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <i className={`${sort.icon} mr-2`}></i>
                      {sort.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Results Area */}
          <div className="lg:col-span-3">
            {/* Loading State */}
            {loading && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Searching the developer community...</p>
                <p className="text-gray-400 text-sm mt-2">Finding the best matches for your criteria</p>
              </div>
            )}

            {/* No Results */}
            {!loading && results.length === 0 && query.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-search text-gray-400 text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No developers found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search criteria or filters</p>
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={clearFilters}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-200"
                  >
                    Clear Filters
                  </button>
                  <button
                    onClick={() => setSearchParams({})}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors duration-200"
                  >
                    Clear Search
                  </button>
                </div>
              </div>
            )}

            {/* Search Results */}
            {!loading && results.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Found {results.length} developer{results.length !== 1 ? 's' : ''}
                  </h2>
                  <div className="text-sm text-gray-500">
                    Sorted by {filters.sortBy.replace('_', ' ')}
                  </div>
                </div>

                {results.map(developer => (
                  <div key={developer._id} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 group">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="relative">
                          <img 
                            src={getProfileImageUrl(developer.profileImageUrl, developer.username)}
                            alt={developer.username}
                            className="w-16 h-16 rounded-full object-cover ring-4 ring-gray-200 group-hover:ring-blue-300 transition-all duration-200"
                            onError={(e) => {
                              e.target.src = `https://placehold.co/64x64/E2E8F0/475569?text=${developer.username.charAt(0)}`;
                            }}
                          />
                          {developer.githubData && (
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                              <i className="fab fa-github text-white text-xs"></i>
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Link 
                              to={`/profile/${developer.username}`} 
                              className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200"
                            >
                              {developer.username}
                            </Link>
                            {developer.githubData?.followers > 100 && (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                <i className="fas fa-star mr-1"></i>Popular
                              </span>
                            )}
                          </div>

                          <p className="text-gray-600 mb-3 leading-relaxed">
                            {developer.bio || 'Passionate developer building amazing things'}
                          </p>

                          {/* Skills */}
                          {developer.skills && developer.skills.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {developer.skills.slice(0, 6).map(skill => (
                                <span 
                                  key={skill} 
                                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                                >
                                  {skill}
                                </span>
                              ))}
                              {developer.skills.length > 6 && (
                                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                  +{developer.skills.length - 6} more
                                </span>
                              )}
                            </div>
                          )}

                          {/* Stats */}
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            {developer.githubData && (
                              <>
                                <div className="flex items-center">
                                  <i className="fas fa-code-branch mr-1 text-blue-500"></i>
                                  {developer.githubData.publicRepos} repos
                                </div>
                                <div className="flex items-center">
                                  <i className="fas fa-users mr-1 text-green-500"></i>
                                  {developer.githubData.followers} followers
                                </div>
                                {developer.githubStats && (
                                  <div className="flex items-center">
                                    <i className="fas fa-star mr-1 text-yellow-500"></i>
                                    {developer.githubStats.totalStars} stars
                                  </div>
                                )}
                              </>
                            )}
                            {developer.githubData?.location && (
                              <div className="flex items-center">
                                <i className="fas fa-map-marker-alt mr-1 text-red-500"></i>
                                {developer.githubData.location}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {currentUser && currentUser._id !== developer._id && (
                        <div className="flex space-x-2">
                          <Link
                            to={`/profile/${developer.username}`}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-200"
                          >
                            View Profile
                          </Link>
                          <button
                            onClick={() => { 
                              setSelectedUserId(developer._id); 
                              setSelectedUserName(developer.username);
                              setShowMessageModal(true); 
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200"
                          >
                            <i className="fas fa-comment mr-2"></i>
                            Message
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar - Recommendations */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Developer Recommendations */}
              {!query && recommendations.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <i className="fas fa-magic text-white text-sm"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Recommended for You</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Based on your skills and interests</p>
                  
                  <div className="space-y-4">
                    {recommendations.map(rec => (
                      <div key={rec._id} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 hover:border-purple-300 transition-all duration-200">
                        <div className="flex items-start space-x-3">
                          <img 
                            src={getProfileImageUrl(rec.profileImageUrl, rec.username)}
                            alt={rec.username}
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => {
                              e.target.src = `https://placehold.co/40x40/8B5CF6/ffffff?text=${rec.username.charAt(0)}`;
                            }}
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <Link 
                                to={`/profile/${rec.username}`}
                                className="font-semibold text-gray-900 hover:text-purple-600 text-sm"
                              >
                                {rec.username}
                              </Link>
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                                {rec.matchPercentage}% match
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">{rec.bio}</p>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {rec.commonSkills.map(skill => (
                                <span key={skill} className="px-2 py-1 bg-purple-200 text-purple-800 rounded-full text-xs font-medium">
                                  {skill}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>{rec.githubData.followers} followers</span>
                              <button
                                onClick={() => {
                                  setSelectedUserId(rec._id);
                                  setSelectedUserName(rec.username);
                                  setShowMessageModal(true);
                                }}
                                className="text-purple-600 hover:text-purple-700 font-medium"
                              >
                                Connect
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Technologies */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <i className="fas fa-chart-line text-white text-sm"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Trending Technologies</h3>
                </div>
                
                <div className="space-y-3">
                  {[
                    { tech: 'React', growth: '+23%', developers: 1250 },
                    { tech: 'TypeScript', growth: '+19%', developers: 980 },
                    { tech: 'Next.js', growth: '+31%', developers: 750 },
                    { tech: 'Rust', growth: '+45%', developers: 420 },
                    { tech: 'Go', growth: '+18%', developers: 680 }
                  ].map((item, index) => (
                    <div key={item.tech} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{item.tech}</div>
                        <div className="text-xs text-gray-500">{item.developers} developers</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-semibold text-green-600">{item.growth}</div>
                        <div className="text-xs text-gray-400">this month</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200">
                    <i className="fas fa-plus mr-3"></i>
                    Create Developer Profile
                  </button>
                  <button className="w-full text-left p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200">
                    <i className="fas fa-users mr-3"></i>
                    Browse Communities
                  </button>
                  <button className="w-full text-left p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200">
                    <i className="fas fa-calendar mr-3"></i>
                    Upcoming Events
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Direct Message Modal */}
        {showMessageModal && selectedUserId && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-transparent rounded-xl shadow-lg p-2 relative w-full max-w-2xl">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg z-10"
                onClick={() => setShowMessageModal(false)}
              >
                &times;
              </button>
              <DirectMessage currentUserId={currentUser._id} otherUserId={selectedUserId} otherUserName={selectedUserName} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
