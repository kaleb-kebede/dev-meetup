import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProfileImageUrl } from '../utils/imageUtils';

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

  // Determine active tab based on current location
  const isHomeActive = location.pathname === '/';
  const isMessagingActive = location.pathname === '/messages';
  const isProfileActive = location.pathname.startsWith('/profile');
  const isSearchActive = location.pathname === '/search';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-lg px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left: Logo + Search */}
        <div className="flex items-center gap-6">
          <Link to="/home" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <i className="fas fa-code text-white text-lg"></i>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                DevMeetup
              </span>
              <div className="text-xs text-gray-500 -mt-1">Developer Community</div>
            </div>
          </Link>
          <form onSubmit={handleSearch} className="relative hidden sm:block">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-50/80 backdrop-blur-sm rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/90 border border-gray-200/50 w-80 transition-all duration-200 hover:bg-white/90"
              placeholder="Search developers, posts, technologies..."
            />
            <span className="absolute left-4 top-3.5 text-gray-400">
              <i className="fas fa-search" />
            </span>
          </form>
        </div>

        {/* Center: Nav - Hidden on mobile */}
        <nav className="hidden md:flex gap-3">
          <NavItem icon="fas fa-terminal" label="Feed" active={isHomeActive} to="/" color="blue" />
          <NavItem icon="fas fa-code-branch" label="Projects" to="/projects" color="green" />
          <NavItem icon="fas fa-users-cog" label="DevNetwork" to="/network" color="purple" />
          <NavItem icon="fas fa-comments" label="Chat" active={isMessagingActive} to="/messages" color="orange" />
          <NavItem icon="fas fa-rocket" label="Challenges" to="/challenges" color="indigo" />
        </nav>

        {/* Right: Developer Tools */}
        <div className="flex items-center gap-3">
          {user && (
            <>
              {/* GitHub Status */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg">
                <i className="fab fa-github text-gray-600"></i>
                <span className="text-xs text-gray-600">
                  {user.githubData?.username ? 'Connected' : 'Connect GitHub'}
                </span>
              </div>
              
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                <i className="fas fa-bell text-lg"></i>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">3</span>
              </button>
              
              {/* Profile Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 transition-all duration-200">
                  <img 
                    src={getProfileImageUrl(user.profileImageUrl, user.username)}
                    alt="Profile"
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-200"
                    onError={(e) => {
                      e.target.src = `https://placehold.co/36x36/60a5fa/fff?text=${user.username.charAt(0)}`;
                    }}
                  />
                  <i className="fas fa-chevron-down text-xs text-gray-500 hidden sm:block"></i>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200/50 backdrop-blur-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                  <div className="p-4">
                    <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                      <img 
                        src={getProfileImageUrl(user.profileImageUrl, user.username)}
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = `https://placehold.co/48x48/60a5fa/fff?text=${user.username.charAt(0)}`;
                        }}
                      />
                      <div>
                        <div className="font-semibold text-gray-900">{user.username}</div>
                        <div className="text-sm text-gray-500">{user.bio || 'Developer'}</div>
                      </div>
                    </div>
                    
                    <div className="py-2 space-y-1">
                      <Link to={`/profile/${user.username}`} className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors duration-200">
                        <i className="fas fa-user w-4"></i>
                        <span className="text-sm">View Profile</span>
                      </Link>
                      <Link to="/profile/edit" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors duration-200">
                        <i className="fas fa-cog w-4"></i>
                        <span className="text-sm">Settings</span>
                      </Link>
                      <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors duration-200">
                        <i className="fas fa-moon w-4"></i>
                        <span className="text-sm">Dark Mode</span>
                      </button>
                    </div>
                    
                    <div className="pt-2 border-t border-gray-100">
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
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
            className="md:hidden p-2"
          >
            <i className="fas fa-bars text-gray-600" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-4">
          <div className="flex flex-col space-y-4">
            <Link to="/" className={`flex items-center gap-3 px-4 py-2 hover:bg-gray-50 ${isHomeActive ? 'text-blue-700' : 'text-gray-500'}`}>
              <i className="fas fa-home" />
              <span>Home</span>
            </Link>
            <Link to="/network" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50">
              <i className="fas fa-user-friends text-gray-500" />
              <span>My Network</span>
            </Link>
            <Link to="/jobs" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50">
              <i className="fas fa-briefcase text-gray-500" />
              <span>Jobs</span>
            </Link>
            <Link to="/messages" className={`flex items-center gap-3 px-4 py-2 hover:bg-gray-50 ${isMessagingActive ? 'text-blue-700' : 'text-gray-500'}`}>
              <i className="fas fa-comment-dots" />
              <span>Messaging</span>
            </Link>
            <Link to="/notifications" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50">
              <i className="fas fa-bell text-gray-500" />
              <span>Notifications</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}