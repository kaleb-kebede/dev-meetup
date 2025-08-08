import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProfileImageUrl } from '../utils/imageUtils';
import api from '../services/api';

function NavItem({ icon, label, active, to, color = 'blue' }) {
  const colorMap = {
    blue: { bg: 'bg-blue-500', hover: 'hover:bg-blue-600', text: 'text-blue-600' },
    green: { bg: 'bg-green-500', hover: 'hover:bg-green-600', text: 'text-green-600' },
    purple: { bg: 'bg-purple-500', hover: 'hover:bg-purple-600', text: 'text-purple-600' },
    orange: { bg: 'bg-orange-500', hover: 'hover:bg-orange-600', text: 'text-orange-600' },
    indigo: { bg: 'bg-indigo-500', hover: 'hover:bg-indigo-600', text: 'text-indigo-600' }
  };
  
  const colors = colorMap[color];
  
  return (
    <Link to={to} className="group relative">
      <div className={`
        flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300
        ${active 
          ? `${colors.bg} text-white shadow-lg transform scale-105` 
          : `text-gray-600 hover:text-white ${colors.hover} hover:shadow-lg hover:transform hover:scale-105`
        }
      `}>
        <i className={`${icon} text-lg`}></i>
        <span className="font-medium text-sm hidden lg:block">{label}</span>
      </div>
      {active && (
        <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 ${colors.bg} rounded-full`}></div>
      )}
    </Link>
  );
}

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [trendingRepos, setTrendingRepos] = useState([]);
  const [showDevTools, setShowDevTools] = useState(false);
  const [githubStatus, setGithubStatus] = useState({ connected: false, stats: null });

  // Load theme on component mount
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Fetch notifications and GitHub status
  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchGithubStatus();
      fetchTrendingRepos();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      // Mock notifications - in real app, this would be an API call
      const mockNotifications = [
        {
          id: 1,
          type: 'follow',
          message: 'sarah_dev started following you',
          time: '2 minutes ago',
          avatar: null,
          unread: true
        },
        {
          id: 2,
          type: 'mention',
          message: 'You were mentioned in a post about React',
          time: '1 hour ago',
          avatar: null,
          unread: true
        },
        {
          id: 3,
          type: 'like',
          message: 'Your code snippet got 5 new likes',
          time: '3 hours ago',
          avatar: null,
          unread: false
        }
      ];
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const fetchGithubStatus = async () => {
    try {
      if (user?.githubData?.username) {
        setGithubStatus({
          connected: true,
          stats: {
            repos: user.githubData.publicRepos || 0,
            stars: user.githubStats?.totalStars || 0,
            lastSync: user.githubStats?.lastSynced || new Date()
          }
        });
      }
    } catch (error) {
      console.error('Failed to fetch GitHub status:', error);
    }
  };

  const fetchTrendingRepos = async () => {
    try {
      // Mock trending repos - in real app, this would fetch from GitHub API
      const mockTrending = [
        { name: 'facebook/react', stars: '220k', language: 'JavaScript' },
        { name: 'microsoft/vscode', stars: '158k', language: 'TypeScript' },
        { name: 'vercel/next.js', stars: '118k', language: 'JavaScript' }
      ];
      setTrendingRepos(mockTrending);
    } catch (error) {
      console.error('Failed to fetch trending repos:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, unread: false }
          : notif
      )
    );
  };

  const unreadNotifications = notifications.filter(n => n.unread).length;

  // Determine active tab based on current location
  const isHomeActive = location.pathname === '/';
  const isMessagingActive = location.pathname === '/messages';
  const isProfileActive = location.pathname.startsWith('/profile');
  const isSearchActive = location.pathname === '/search';
  const isProjectsActive = location.pathname === '/projects';
  const isNetworkActive = location.pathname === '/network';
  const isChallengesActive = location.pathname === '/challenges';

  return (
    <header className={`sticky top-0 z-50 border-b shadow-lg px-4 py-3 transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gray-900/95 border-gray-700/50 text-white' 
        : 'bg-white/95 border-gray-200/50'
    } backdrop-blur-md`}>
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left: Logo + Search */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
              <i className="fas fa-code text-white text-lg"></i>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                DevMeetup
              </span>
              <div className={`text-xs -mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Developer Community</div>
            </div>
          </Link>
          
          <form onSubmit={handleSearch} className="relative hidden sm:block">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border w-80 transition-all duration-200 ${
                isDarkMode
                  ? 'bg-gray-800/80 border-gray-600/50 text-white placeholder-gray-400 focus:bg-gray-800'
                  : 'bg-gray-50/80 border-gray-200/50 focus:bg-white/90 hover:bg-white/90'
              } backdrop-blur-sm`}
              placeholder="Search developers, posts, technologies..."
            />
            <span className={`absolute left-4 top-3.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>
              <i className="fas fa-search" />
            </span>
          </form>
        </div>

        {/* Center: Enhanced Nav */}
        <nav className="hidden lg:flex gap-2">
          <NavItem 
            icon="fas fa-terminal" 
            label="Feed" 
            active={isHomeActive} 
            to="/" 
            color="blue" 
          />
          <NavItem 
            icon="fas fa-code-branch" 
            label="Projects" 
            active={isProjectsActive}
            to="/projects" 
            color="green" 
          />
          <NavItem 
            icon="fas fa-users-cog" 
            label="DevNetwork" 
            active={isNetworkActive}
            to="/network" 
            color="purple" 
          />
          <NavItem 
            icon="fas fa-comments" 
            label="Chat" 
            active={isMessagingActive} 
            to="/messages" 
            color="orange" 
          />
          <NavItem 
            icon="fas fa-rocket" 
            label="Challenges" 
            active={isChallengesActive}
            to="/challenges" 
            color="indigo" 
          />
        </nav>

        {/* Right: Advanced Developer Tools */}
        <div className="flex items-center gap-2">
          {user && (
            <>
              {/* Developer Tools Dropdown */}
              <div className="relative group hidden xl:block">
                <button 
                  onClick={() => setShowDevTools(!showDevTools)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isDarkMode 
                      ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-800'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <i className="fas fa-tools text-sm"></i>
                  <span className="text-sm font-medium">Dev Tools</span>
                  <i className="fas fa-chevron-down text-xs"></i>
                </button>
                
                {/* Dev Tools Dropdown */}
                {showDevTools && (
                  <div className={`absolute right-0 top-full mt-2 w-72 rounded-2xl shadow-2xl border backdrop-blur-sm transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-800/95 border-gray-600/50'
                      : 'bg-white/95 border-gray-200/50'
                  }`}>
                    <div className="p-4">
                      <h3 className={`font-semibold text-sm mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Quick Access</h3>
                      <div className="space-y-2">
                        <a href="https://github.com/trending" target="_blank" rel="noopener noreferrer" 
                           className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                             isDarkMode
                               ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                               : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                           }`}>
                          <i className="fab fa-github w-4"></i>
                          <span className="text-sm">Trending Repos</span>
                        </a>
                        <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                          isDarkMode
                            ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}>
                          <i className="fas fa-code w-4"></i>
                          <span className="text-sm">Code Snippets</span>
                        </button>
                        <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                          isDarkMode
                            ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}>
                          <i className="fas fa-chart-line w-4"></i>
                          <span className="text-sm">Analytics</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* GitHub Integration Status */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-lg transition-all duration-200">
                <div className="flex items-center gap-2">
                  <i className={`fab fa-github ${githubStatus.connected ? 'text-green-500' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')}`}></i>
                  <span className={`text-xs ${
                    githubStatus.connected 
                      ? 'text-green-600' 
                      : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
                  }`}>
                    {githubStatus.connected ? 'Synced' : 'Connect'}
                  </span>
                  {githubStatus.connected && (
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>
              
              {/* Enhanced Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`relative p-2 rounded-lg transition-all duration-200 ${
                    isDarkMode 
                      ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-800'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <i className="fas fa-bell text-lg"></i>
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-xs flex items-center justify-center text-white font-bold animate-pulse">
                      {unreadNotifications}
                    </span>
                  )}
                </button>
                
                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className={`absolute right-0 top-full mt-2 w-80 rounded-2xl shadow-2xl border backdrop-blur-sm transition-all duration-300 max-h-96 overflow-y-auto ${
                    isDarkMode 
                      ? 'bg-gray-800/95 border-gray-600/50'
                      : 'bg-white/95 border-gray-200/50'
                  }`}>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Notifications</h3>
                        <button className={`text-xs ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} hover:underline`}>
                          Mark all as read
                        </button>
                      </div>
                      <div className="space-y-2">
                        {notifications.map((notification) => (
                          <div 
                            key={notification.id}
                            onClick={() => markNotificationAsRead(notification.id)}
                            className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                              notification.unread 
                                ? (isDarkMode ? 'bg-blue-900/20 border-l-4 border-blue-500' : 'bg-blue-50 border-l-4 border-blue-500')
                                : (isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50')
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                notification.type === 'follow' ? 'bg-green-100 text-green-600' :
                                notification.type === 'mention' ? 'bg-blue-100 text-blue-600' :
                                'bg-purple-100 text-purple-600'
                              }`}>
                                <i className={`fas ${
                                  notification.type === 'follow' ? 'fa-user-plus' :
                                  notification.type === 'mention' ? 'fa-at' :
                                  'fa-heart'
                                } text-xs`}></i>
                              </div>
                              <div className="flex-1">
                                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                                  {notification.message}
                                </p>
                                <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                  {notification.time}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Dark Mode Toggle */}
              <button 
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isDarkMode 
                    ? 'text-yellow-400 hover:text-yellow-300 hover:bg-gray-800'
                    : 'text-gray-600 hover:text-yellow-600 hover:bg-yellow-50'
                }`}
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'} text-lg`}></i>
              </button>
              
              {/* Enhanced Profile Dropdown */}
              <div className="relative group">
                <button className={`flex items-center gap-2 p-1 rounded-lg transition-all duration-200 ${
                  isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}>
                  <img 
                    src={getProfileImageUrl(user.profileImageUrl, user.username)}
                    alt="Profile"
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-300 dark:ring-gray-600"
                    onError={(e) => {
                      e.target.src = `https://placehold.co/36x36/60a5fa/fff?text=${user.username.charAt(0)}`;
                    }}
                  />
                  <i className={`fas fa-chevron-down text-xs hidden sm:block ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}></i>
                </button>
                
                {/* Enhanced Profile Dropdown Menu */}
                <div className={`absolute right-0 top-full mt-2 w-72 rounded-2xl shadow-2xl border backdrop-blur-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 ${
                  isDarkMode 
                    ? 'bg-gray-800/95 border-gray-600/50'
                    : 'bg-white/95 border-gray-200/50'
                }`}>
                  <div className="p-4">
                    {/* Profile Header */}
                    <div className={`flex items-center gap-3 pb-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <img 
                        src={getProfileImageUrl(user.profileImageUrl, user.username)}
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = `https://placehold.co/48x48/60a5fa/fff?text=${user.username.charAt(0)}`;
                        }}
                      />
                      <div>
                        <div className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{user.username}</div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user.bio || 'Developer'}</div>
                        {githubStatus.connected && (
                          <div className="flex items-center gap-1 mt-1">
                            <i className="fab fa-github text-xs text-green-500"></i>
                            <span className="text-xs text-green-600">{user.githubData?.username}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Quick Stats */}
                    {githubStatus.connected && (
                      <div className={`py-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div>
                            <div className={`text-lg font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                              {githubStatus.stats?.repos || 0}
                            </div>
                            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Repos</div>
                          </div>
                          <div>
                            <div className={`text-lg font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                              {githubStatus.stats?.stars || 0}
                            </div>
                            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Stars</div>
                          </div>
                          <div>
                            <div className={`text-lg font-bold text-green-500`}>
                              {user.connectionsCount || 0}
                            </div>
                            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Connections</div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Menu Items */}
                    <div className="py-2 space-y-1">
                      <Link to={`/profile/${user.username}`} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                        isDarkMode
                          ? 'text-gray-300 hover:bg-blue-900/20 hover:text-blue-400'
                          : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                      }`}>
                        <i className="fas fa-user w-4"></i>
                        <span className="text-sm">View Profile</span>
                      </Link>
                      <Link to="/profile/edit" className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                        isDarkMode
                          ? 'text-gray-300 hover:bg-green-900/20 hover:text-green-400'
                          : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                      }`}>
                        <i className="fas fa-cog w-4"></i>
                        <span className="text-sm">Settings</span>
                      </Link>
                      <Link to="/analytics" className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                        isDarkMode
                          ? 'text-gray-300 hover:bg-purple-900/20 hover:text-purple-400'
                          : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                      }`}>
                        <i className="fas fa-chart-line w-4"></i>
                        <span className="text-sm">Analytics</span>
                      </Link>
                    </div>
                    
                    {/* Logout */}
                    <div className={`pt-2 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                      <button 
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                          isDarkMode
                            ? 'text-red-400 hover:bg-red-900/20'
                            : 'text-red-600 hover:bg-red-50'
                        }`}
                      >
                        <i className="fas fa-sign-out-alt w-4"></i>
                        <span className="text-sm">Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {/* Mobile menu button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors duration-200 ${
              isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <i className="fas fa-bars" />
          </button>
        </div>
      </div>

      {/* Enhanced Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={`md:hidden border-t py-4 backdrop-blur-sm ${
          isDarkMode ? 'bg-gray-900/95 border-gray-700' : 'bg-white/95 border-gray-200'
        }`}>
          <div className="flex flex-col space-y-2 px-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border transition-all duration-200 ${
                  isDarkMode
                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-gray-50 border-gray-200'
                }`}
                placeholder="Search..."
              />
              <i className={`fas fa-search absolute left-3 top-2.5 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}></i>
            </form>
            
            {/* Mobile Nav Items */}
            <Link to="/" className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors duration-200 ${
              isHomeActive 
                ? (isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-700')
                : (isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50')
            }`}>
              <i className="fas fa-terminal w-5" />
              <span>Feed</span>
            </Link>
            <Link to="/projects" className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors duration-200 ${
              isProjectsActive
                ? (isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-50 text-green-700')
                : (isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50')
            }`}>
              <i className="fas fa-code-branch w-5" />
              <span>Projects</span>
            </Link>
            <Link to="/network" className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors duration-200 ${
              isNetworkActive
                ? (isDarkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-50 text-purple-700')
                : (isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50')
            }`}>
              <i className="fas fa-users-cog w-5" />
              <span>DevNetwork</span>
            </Link>
            <Link to="/messages" className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors duration-200 ${
              isMessagingActive
                ? (isDarkMode ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-50 text-orange-700')
                : (isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50')
            }`}>
              <i className="fas fa-comments w-5" />
              <span>Messages</span>
              {unreadNotifications > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {unreadNotifications}
                </span>
              )}
            </Link>
            <Link to="/challenges" className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors duration-200 ${
              isChallengesActive
                ? (isDarkMode ? 'bg-indigo-900/30 text-indigo-400' : 'bg-indigo-50 text-indigo-700')
                : (isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50')
            }`}>
              <i className="fas fa-rocket w-5" />
              <span>Challenges</span>
            </Link>
            
            {/* Mobile Dark Mode Toggle */}
            <button 
              onClick={toggleDarkMode}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors duration-200 ${
                isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'} w-5`}></i>
              <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
