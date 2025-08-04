import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProfileImageUrl } from '../utils/imageUtils';

function NavItem({ icon, label, active, to }) {
  return (
    <Link to={to} className="flex flex-col items-center cursor-pointer group">
      <span className={`text-xl mb-1 ${active ? 'text-blue-700' : 'text-gray-500 group-hover:text-blue-700'}`}>
        <i className={`fas ${icon}`}></i>
      </span>
      <span className={`text-xs ${active ? 'text-black font-semibold underline underline-offset-4 decoration-2' : 'text-gray-600 group-hover:text-blue-700'}`}>{label}</span>
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
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-2">
      <div className="flex items-center justify-between">
        {/* Left: Logo + Search */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">in</span>
            </div>
          </Link>
          <form onSubmit={handleSearch} className="relative hidden sm:block">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-100 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              placeholder="Search"
            />
            <span className="absolute left-3 top-2.5 text-gray-500">
              <i className="fas fa-search" />
            </span>
          </form>
        </div>

        {/* Center: Nav - Hidden on mobile */}
        <nav className="hidden md:flex gap-8">
          <NavItem icon="fa-home" label="Home" active={isHomeActive} to="/" />
          <NavItem icon="fa-user-friends" label="My Network" to="/network" />
          <NavItem icon="fa-briefcase" label="Jobs" to="/jobs" />
          <NavItem icon="fa-comment-dots" label="Messaging" active={isMessagingActive} to="/messages" />
          <NavItem icon="fa-bell" label="Notifications" to="/notifications" />
        </nav>

        {/* Right: Profile, Business, Premium */}
        <div className="flex items-center gap-4">
          {user && (
            <>
              <Link to={`/profile/${user.username}`} className="hidden sm:flex items-center gap-2">
                <img 
                  src={getProfileImageUrl(user.profileImageUrl, user.username)}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                  onError={(e) => {
                    e.target.src = `https://placehold.co/32x32/60a5fa/fff?text=${user.username.charAt(0)}`;
                  }}
                />
                <span className="text-sm text-gray-700">Me</span>
              </Link>
              <span className="hidden lg:inline text-sm text-gray-700 cursor-pointer">For Business</span>
              <a href="#" className="hidden lg:inline text-yellow-700 font-semibold text-sm">Try Premium for $0</a>
              <button 
                onClick={handleLogout}
                className="text-sm text-gray-700 hover:text-red-600"
              >
                Logout
              </button>
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