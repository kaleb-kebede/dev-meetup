import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import Spinner from './Spinner';

export default function GitHubProfile({ user, onUpdate }) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [githubUsername, setGithubUsername] = useState('');
  const [showConnectForm, setShowConnectForm] = useState(false);
  const [repositories, setRepositories] = useState([]);
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [showAllRepos, setShowAllRepos] = useState(false);

  useEffect(() => {
    if (user?.githubData?.username) {
      fetchRepositories();
    }
  }, [user?.githubData?.username]);

  const fetchRepositories = async () => {
    try {
      setIsLoadingRepos(true);
      const response = await api.get('/github/repositories');
      setRepositories(response.data.repositories);
    } catch (error) {
      console.error('Error fetching repositories:', error);
    } finally {
      setIsLoadingRepos(false);
    }
  };

  const handleConnectGitHub = async (e) => {
    e.preventDefault();
    if (!githubUsername.trim()) {
      toast.error('Please enter a GitHub username');
      return;
    }

    setIsConnecting(true);
    try {
      const response = await api.post('/github/connect', {
        githubUsername: githubUsername.trim()
      });
      
      toast.success('GitHub account connected successfully!');
      setShowConnectForm(false);
      setGithubUsername('');
      onUpdate && onUpdate(response.data.user);
      
      // Fetch repositories after connecting
      setTimeout(() => {
        fetchRepositories();
      }, 1000);
      
    } catch (error) {
      console.error('Error connecting GitHub:', error);
      const message = error.response?.data?.message || 'Failed to connect GitHub account';
      toast.error(message);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSyncGitHub = async () => {
    setIsSyncing(true);
    try {
      const response = await api.put('/github/sync');
      toast.success('GitHub data synced successfully!');
      onUpdate && onUpdate(response.data.user);
      fetchRepositories();
    } catch (error) {
      console.error('Error syncing GitHub:', error);
      const message = error.response?.data?.message || 'Failed to sync GitHub data';
      toast.error(message);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDisconnectGitHub = async () => {
    if (!window.confirm('Are you sure you want to disconnect your GitHub account?')) {
      return;
    }

    try {
      const response = await api.delete('/github/disconnect');
      toast.success('GitHub account disconnected');
      onUpdate && onUpdate(response.data.user);
      setRepositories([]);
    } catch (error) {
      console.error('Error disconnecting GitHub:', error);
      toast.error('Failed to disconnect GitHub account');
    }
  };

  const toggleRepositoryPin = async (repoId) => {
    try {
      await api.put(`/github/repositories/${repoId}/pin`);
      fetchRepositories();
      toast.success('Repository pin status updated');
    } catch (error) {
      console.error('Error toggling repository pin:', error);
      toast.error('Failed to update repository pin status');
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

  if (!user?.githubData?.username && !showConnectForm) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fab fa-github text-2xl text-gray-600"></i>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect GitHub</h3>
          <p className="text-gray-600 text-sm mb-4">
            Showcase your repositories and GitHub activity on your profile
          </p>
          <button
            onClick={() => setShowConnectForm(true)}
            className="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-4 py-2 rounded-lg hover:from-gray-800 hover:to-black transition-all duration-200 transform hover:scale-105"
          >
            <i className="fab fa-github mr-2"></i>
            Connect GitHub
          </button>
        </div>
      </div>
    );
  }

  if (showConnectForm) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <form onSubmit={handleConnectGitHub}>
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fab fa-github text-2xl text-gray-600"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect GitHub Account</h3>
            <p className="text-gray-600 text-sm">
              Enter your GitHub username to connect your account
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GitHub Username
              </label>
              <input
                type="text"
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
                placeholder="e.g., octocat"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                This will be used to fetch your public repositories and profile information
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isConnecting || !githubUsername.trim()}
                className="flex-1 bg-gradient-to-r from-gray-700 to-gray-900 text-white py-2 px-4 rounded-lg hover:from-gray-800 hover:to-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConnecting ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <i className="fab fa-github mr-2"></i>
                    Connect
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowConnectForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  const pinnedRepos = repositories.filter(repo => repo.isPinned);
  const displayedRepos = showAllRepos ? repositories : repositories.slice(0, 6);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      {/* GitHub Profile Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center">
          <img
            src={user.githubData.avatarUrl}
            alt={user.githubData.username}
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <div className="flex items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {user.githubData.username}
              </h3>
              <a
                href={user.githubData.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <i className="fas fa-external-link-alt text-sm"></i>
              </a>
            </div>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <span className="mr-4">
                <i className="fas fa-code-branch mr-1"></i>
                {user.githubData.publicRepos} repos
              </span>
              <span className="mr-4">
                <i className="fas fa-users mr-1"></i>
                {user.githubData.followers} followers
              </span>
              <span>
                <i className="fas fa-star mr-1"></i>
                {user.githubStats?.totalStars || 0} stars
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleSyncGitHub}
            disabled={isSyncing}
            className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            title="Sync GitHub data"
          >
            {isSyncing ? (
              <Spinner size="sm" />
            ) : (
              <i className="fas fa-sync-alt"></i>
            )}
          </button>
          <button
            onClick={handleDisconnectGitHub}
            className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
            title="Disconnect GitHub"
          >
            <i className="fas fa-unlink"></i>
          </button>
        </div>
      </div>

      {/* GitHub Bio */}
      {user.githubData.bio && (
        <p className="text-gray-700 mb-4">{user.githubData.bio}</p>
      )}

      {/* GitHub Stats */}
      {user.githubStats?.primaryLanguages?.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Top Languages</h4>
          <div className="flex flex-wrap gap-2">
            {user.githubStats.primaryLanguages.slice(0, 5).map((lang, index) => (
              <span
                key={index}
                className={`px-2 py-1 rounded-full text-xs font-medium ${getLanguageColor(lang.language)}`}
              >
                {lang.language} {lang.percentage}%
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Pinned Repositories */}
      {pinnedRepos.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <i className="fas fa-thumbtack mr-2 text-cyan-600"></i>
            Pinned Repositories
          </h4>
          <div className="grid grid-cols-1 gap-3">
            {pinnedRepos.map((repo) => (
              <div key={repo.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <a
                        href={repo.htmlUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-600 hover:text-cyan-700 font-medium text-sm"
                      >
                        {repo.name}
                      </a>
                      <button
                        onClick={() => toggleRepositoryPin(repo.id)}
                        className="ml-2 text-cyan-600 hover:text-cyan-700"
                        title="Unpin repository"
                      >
                        <i className="fas fa-thumbtack text-xs"></i>
                      </button>
                    </div>
                    {repo.description && (
                      <p className="text-gray-600 text-xs mt-1">{repo.description}</p>
                    )}
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      {repo.language && (
                        <span className={`px-1.5 py-0.5 rounded text-xs ${getLanguageColor(repo.language)} mr-3`}>
                          {repo.language}
                        </span>
                      )}
                      <span className="mr-3">
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
        </div>
      )}

      {/* All Repositories */}
      {isLoadingRepos ? (
        <div className="text-center py-8">
          <Spinner />
          <p className="text-gray-600 mt-2">Loading repositories...</p>
        </div>
      ) : repositories.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900">
              Repositories ({repositories.length})
            </h4>
            {repositories.length > 6 && (
              <button
                onClick={() => setShowAllRepos(!showAllRepos)}
                className="text-cyan-600 hover:text-cyan-700 text-sm font-medium"
              >
                {showAllRepos ? 'Show less' : 'Show all'}
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {displayedRepos.map((repo) => (
              <div key={repo.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <a
                        href={repo.htmlUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-600 hover:text-cyan-700 font-medium text-sm"
                      >
                        {repo.name}
                      </a>
                      <button
                        onClick={() => toggleRepositoryPin(repo.id)}
                        className={`ml-2 hover:text-cyan-700 ${
                          repo.isPinned ? 'text-cyan-600' : 'text-gray-400'
                        }`}
                        title={repo.isPinned ? 'Unpin repository' : 'Pin repository'}
                      >
                        <i className="fas fa-thumbtack text-xs"></i>
                      </button>
                    </div>
                    {repo.description && (
                      <p className="text-gray-600 text-xs mt-1 line-clamp-2">{repo.description}</p>
                    )}
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      {repo.language && (
                        <span className={`px-1.5 py-0.5 rounded text-xs ${getLanguageColor(repo.language)} mr-3`}>
                          {repo.language}
                        </span>
                      )}
                      <span className="mr-3">
                        <i className="fas fa-star mr-1"></i>
                        {repo.stargazersCount}
                      </span>
                      <span className="mr-3">
                        <i className="fas fa-code-branch mr-1"></i>
                        {repo.forksCount}
                      </span>
                      <span className="text-gray-400">
                        Updated {new Date(repo.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <i className="fas fa-code-branch text-4xl text-gray-400 mb-2"></i>
          <p className="text-gray-600">No repositories found</p>
        </div>
      )}
    </div>
  );
}
