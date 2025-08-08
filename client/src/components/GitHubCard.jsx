import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function GitHubCard({ user, isOwn = false }) {
  const [repositories, setRepositories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.githubData?.username) {
      fetchPinnedRepositories();
    }
  }, [user?.githubData?.username]);

  const fetchPinnedRepositories = async () => {
    try {
      setIsLoading(true);
      // Only fetch repositories if it's the current user's own profile
      // For other users, we'll use the data that's already in the user object
      if (isOwn) {
        const response = await api.get('/github/repositories?pinned_only=true');
        setRepositories(response.data.repositories || []);
      } else {
        // For other users' profiles, use the data from user object
        const pinnedRepos = user.githubRepositories?.filter(repo => repo.isPinned) || [];
        setRepositories(pinnedRepos);
      }
    } catch (error) {
      console.error('Error fetching pinned repositories:', error);
      // Fallback to user object data
      const pinnedRepos = user.githubRepositories?.filter(repo => repo.isPinned) || [];
      setRepositories(pinnedRepos);
    } finally {
      setIsLoading(false);
    }
  };

  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: 'bg-yellow-100 text-yellow-800',
      Python: 'bg-blue-100 text-blue-800',
      Java: 'bg-orange-100 text-orange-800',
      TypeScript: 'bg-blue-100 text-blue-800',
      React: 'bg-cyan-100 text-cyan-800',
      'C++': 'bg-pink-100 text-pink-800',
      'C#': 'bg-purple-100 text-purple-800',
      Go: 'bg-cyan-100 text-cyan-800',
      Rust: 'bg-orange-100 text-orange-800',
      PHP: 'bg-indigo-100 text-indigo-800',
      Ruby: 'bg-red-100 text-red-800',
      Swift: 'bg-orange-100 text-orange-800',
      Kotlin: 'bg-purple-100 text-purple-800',
      HTML: 'bg-orange-100 text-orange-800',
      CSS: 'bg-blue-100 text-blue-800',
      Other: 'bg-gray-100 text-gray-800'
    };
    return colors[language] || colors.Other;
  };

  if (!user?.githubData?.username) {
    return null; // Don't show card if no GitHub connection
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg flex items-center justify-center mr-3">
            <i className="fab fa-github text-white text-lg"></i>
          </div>
          <h3 className="text-lg font-bold text-gray-900">GitHub Profile</h3>
        </div>
        <a
          href={user.githubData.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
          title="View GitHub Profile"
        >
          <i className="fas fa-external-link-alt text-sm"></i>
        </a>
      </div>

      {/* GitHub Profile Info */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center mb-3">
          <img
            src={user.githubData.avatarUrl}
            alt={user.githubData.username}
            className="w-10 h-10 rounded-full mr-3 ring-2 ring-gray-200"
          />
          <div>
            <div className="font-semibold text-gray-900">
              @{user.githubData.username}
            </div>
            <div className="text-xs text-gray-500">
              {user.githubData.followers || 0} followers
            </div>
          </div>
        </div>
        
        {/* GitHub Stats Grid */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-xl font-bold text-blue-600">{user.githubData.publicRepos}</div>
            <div className="text-xs text-gray-500 font-medium">Repositories</div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-xl font-bold text-yellow-500">{user.githubStats?.totalStars || 0}</div>
            <div className="text-xs text-gray-500 font-medium">Total Stars</div>
          </div>
        </div>
      </div>

      {/* Primary Languages */}
      {user.githubStats?.primaryLanguages?.length > 0 && (
        <div className="mb-4">
          <div className="text-xs font-medium text-gray-700 mb-2">Top Languages</div>
          <div className="flex flex-wrap gap-1">
            {user.githubStats.primaryLanguages.slice(0, 3).map((lang, index) => (
              <span
                key={index}
                className={`px-1.5 py-0.5 rounded text-xs ${getLanguageColor(lang.language)}`}
              >
                {lang.language}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Pinned Repositories */}
      {isLoading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-600 mx-auto"></div>
          <p className="text-xs text-gray-500 mt-2">Loading repos...</p>
        </div>
      ) : repositories.length > 0 ? (
        <div>
          <div className="text-xs font-medium text-gray-700 mb-2 flex items-center">
            <i className="fas fa-thumbtack mr-1 text-cyan-600"></i>
            Pinned Repos
          </div>
          <div className="space-y-2">
            {repositories.slice(0, 3).map((repo) => (
              <div key={repo.id} className="border border-gray-200 rounded-lg p-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <a
                      href={repo.htmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-600 hover:text-cyan-700 text-xs font-medium truncate block"
                    >
                      {repo.name}
                    </a>
                    {repo.description && (
                      <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                        {repo.description.length > 50 
                          ? `${repo.description.substring(0, 50)}...` 
                          : repo.description
                        }
                      </p>
                    )}
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      {repo.language && (
                        <span className={`px-1 py-0.5 rounded text-xs ${getLanguageColor(repo.language)} mr-2`}>
                          {repo.language}
                        </span>
                      )}
                      <span className="mr-2">
                        <i className="fas fa-star mr-1"></i>
                        {repo.stargazersCount}
                      </span>
                      <span>
                        <i className="fas fa-code-branch mr-1"></i>
                        {repo.forksCount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {repositories.length > 3 && (
            <div className="text-center mt-3">
              <a
                href={user.githubData.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-600 hover:text-cyan-700 text-xs font-medium"
              >
                View all {repositories.length} pinned repos
              </a>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-2">
          <i className="fas fa-code-branch text-gray-400 text-lg"></i>
          <p className="text-xs text-gray-500 mt-1">No pinned repos</p>
        </div>
      )}
    </div>
  );
}
