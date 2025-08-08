import axios from 'axios';
import User from '../models/User.js';

// GitHub API base URL
const GITHUB_API_BASE = 'https://api.github.com';

// Helper function to make GitHub API requests
const githubRequest = async (endpoint, token = null) => {
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'DevMeetup-App/1.0'
  };
  
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }
  
  try {
    const response = await axios.get(`${GITHUB_API_BASE}${endpoint}`, { headers });
    return response.data;
  } catch (error) {
    console.error(`GitHub API Error for ${endpoint}:`, error.response?.data || error.message);
    throw new Error(`GitHub API request failed: ${error.response?.status || error.message}`);
  }
};

// @desc    Connect GitHub account by username
// @route   POST /api/github/connect
// @access  Private
export const connectGitHub = async (req, res) => {
  try {
    const { githubUsername } = req.body;
    const userId = req.user.id;

    if (!githubUsername) {
      return res.status(400).json({ message: 'GitHub username is required' });
    }

    // Fetch GitHub user data
    const githubUserData = await githubRequest(`/users/${githubUsername}`);
    
    // Fetch user repositories
    const repositories = await githubRequest(`/users/${githubUsername}/repos?sort=updated&per_page=100`);

    // Process repositories data
    const processedRepos = repositories
      .filter(repo => !repo.fork) // Exclude forks by default
      .map(repo => ({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description || '',
        htmlUrl: repo.html_url,
        language: repo.language || 'Other',
        stargazersCount: repo.stargazers_count,
        forksCount: repo.forks_count,
        size: repo.size,
        defaultBranch: repo.default_branch,
        createdAt: new Date(repo.created_at),
        updatedAt: new Date(repo.updated_at),
        pushedAt: new Date(repo.pushed_at),
        topics: repo.topics || [],
        isPinned: false // Will be set manually by user later
      }));

    // Calculate stats
    const stats = calculateGitHubStats(processedRepos, githubUserData);

    // Update user with GitHub data
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          githubData: {
            username: githubUserData.login,
            profileUrl: githubUserData.html_url,
            avatarUrl: githubUserData.avatar_url,
            bio: githubUserData.bio || '',
            publicRepos: githubUserData.public_repos,
            followers: githubUserData.followers,
            following: githubUserData.following,
            location: githubUserData.location || '',
            company: githubUserData.company || '',
            blog: githubUserData.blog || '',
            createdAt: new Date(githubUserData.created_at),
            updatedAt: new Date(githubUserData.updated_at)
          },
          githubRepositories: processedRepos,
          githubStats: {
            ...stats,
            lastSynced: new Date()
          }
        }
      },
      { new: true }
    ).select('-password');

    res.status(200).json({
      message: 'GitHub account connected successfully',
      user: updatedUser,
      stats: {
        totalRepos: processedRepos.length,
        totalStars: stats.totalStars,
        totalForks: stats.totalForks,
        primaryLanguage: stats.primaryLanguages[0]?.language || 'Not specified'
      }
    });

  } catch (error) {
    console.error('Error connecting GitHub:', error);
    
    if (error.message.includes('404')) {
      return res.status(404).json({ message: 'GitHub user not found' });
    }
    
    res.status(500).json({ 
      message: 'Failed to connect GitHub account',
      error: error.message 
    });
  }
};

// @desc    Sync GitHub data (refresh)
// @route   PUT /api/github/sync
// @access  Private
export const syncGitHub = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user.githubData?.username) {
      return res.status(400).json({ message: 'No GitHub account connected' });
    }

    const githubUsername = user.githubData.username;

    // Re-fetch GitHub data
    const githubUserData = await githubRequest(`/users/${githubUsername}`);
    const repositories = await githubRequest(`/users/${githubUsername}/repos?sort=updated&per_page=100`);

    // Process repositories while preserving pinned status
    const existingPinnedRepos = user.githubRepositories
      .filter(repo => repo.isPinned)
      .map(repo => repo.id);

    const processedRepos = repositories
      .filter(repo => !repo.fork)
      .map(repo => ({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description || '',
        htmlUrl: repo.html_url,
        language: repo.language || 'Other',
        stargazersCount: repo.stargazers_count,
        forksCount: repo.forks_count,
        size: repo.size,
        defaultBranch: repo.default_branch,
        createdAt: new Date(repo.created_at),
        updatedAt: new Date(repo.updated_at),
        pushedAt: new Date(repo.pushed_at),
        topics: repo.topics || [],
        isPinned: existingPinnedRepos.includes(repo.id)
      }));

    // Calculate updated stats
    const stats = calculateGitHubStats(processedRepos, githubUserData);

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          githubData: {
            username: githubUserData.login,
            profileUrl: githubUserData.html_url,
            avatarUrl: githubUserData.avatar_url,
            bio: githubUserData.bio || '',
            publicRepos: githubUserData.public_repos,
            followers: githubUserData.followers,
            following: githubUserData.following,
            location: githubUserData.location || '',
            company: githubUserData.company || '',
            blog: githubUserData.blog || '',
            createdAt: new Date(githubUserData.created_at),
            updatedAt: new Date(githubUserData.updated_at)
          },
          githubRepositories: processedRepos,
          githubStats: {
            ...stats,
            lastSynced: new Date()
          }
        }
      },
      { new: true }
    ).select('-password');

    res.status(200).json({
      message: 'GitHub data synced successfully',
      user: updatedUser,
      stats: {
        totalRepos: processedRepos.length,
        totalStars: stats.totalStars,
        totalForks: stats.totalForks,
        lastSynced: new Date()
      }
    });

  } catch (error) {
    console.error('Error syncing GitHub:', error);
    res.status(500).json({ 
      message: 'Failed to sync GitHub data',
      error: error.message 
    });
  }
};

// @desc    Get GitHub repositories
// @route   GET /api/github/repositories
// @access  Private
export const getGitHubRepositories = async (req, res) => {
  try {
    const userId = req.user.id;
    const { pinned_only = false } = req.query;

    const user = await User.findById(userId).select('githubRepositories githubData githubStats');

    if (!user.githubData?.username) {
      return res.status(400).json({ message: 'No GitHub account connected' });
    }

    let repositories = user.githubRepositories || [];

    if (pinned_only === 'true') {
      repositories = repositories.filter(repo => repo.isPinned);
    }

    // Sort by stars and recent activity
    repositories.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return (b.stargazersCount + b.forksCount) - (a.stargazersCount + a.forksCount);
    });

    res.status(200).json({
      repositories,
      stats: user.githubStats,
      githubProfile: user.githubData
    });

  } catch (error) {
    console.error('Error fetching repositories:', error);
    res.status(500).json({ 
      message: 'Failed to fetch repositories',
      error: error.message 
    });
  }
};

// @desc    Pin/Unpin repository
// @route   PUT /api/github/repositories/:repoId/pin
// @access  Private
export const toggleRepositoryPin = async (req, res) => {
  try {
    const userId = req.user.id;
    const { repoId } = req.params;

    const user = await User.findById(userId);
    
    if (!user.githubRepositories) {
      return res.status(400).json({ message: 'No GitHub repositories found' });
    }

    const repoIndex = user.githubRepositories.findIndex(repo => repo.id === parseInt(repoId));
    
    if (repoIndex === -1) {
      return res.status(404).json({ message: 'Repository not found' });
    }

    // Toggle pin status
    user.githubRepositories[repoIndex].isPinned = !user.githubRepositories[repoIndex].isPinned;

    await user.save();

    res.status(200).json({
      message: `Repository ${user.githubRepositories[repoIndex].isPinned ? 'pinned' : 'unpinned'} successfully`,
      repository: user.githubRepositories[repoIndex]
    });

  } catch (error) {
    console.error('Error toggling repository pin:', error);
    res.status(500).json({ 
      message: 'Failed to update repository pin status',
      error: error.message 
    });
  }
};

// @desc    Disconnect GitHub account
// @route   DELETE /api/github/disconnect
// @access  Private
export const disconnectGitHub = async (req, res) => {
  try {
    const userId = req.user.id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $unset: {
          githubData: 1,
          githubRepositories: 1,
          githubStats: 1
        }
      },
      { new: true }
    ).select('-password');

    res.status(200).json({
      message: 'GitHub account disconnected successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error disconnecting GitHub:', error);
    res.status(500).json({ 
      message: 'Failed to disconnect GitHub account',
      error: error.message 
    });
  }
};

// Helper function to calculate GitHub stats
function calculateGitHubStats(repositories, githubUserData) {
  const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazersCount, 0);
  const totalForks = repositories.reduce((sum, repo) => sum + repo.forksCount, 0);
  
  // Calculate language statistics
  const languageStats = {};
  repositories.forEach(repo => {
    if (repo.language) {
      languageStats[repo.language] = (languageStats[repo.language] || 0) + 1;
    }
  });

  // Convert to percentage and sort
  const totalRepos = repositories.length;
  const primaryLanguages = Object.entries(languageStats)
    .map(([language, count]) => ({
      language,
      percentage: Math.round((count / totalRepos) * 100)
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5); // Top 5 languages

  return {
    totalCommits: 0, // Would need additional API calls to get this
    totalStars,
    totalForks,
    primaryLanguages
  };
}
