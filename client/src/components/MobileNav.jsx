import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MobileNav() {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = [
    { icon: 'fa-home', label: 'Home', path: '/' },
    { icon: 'fa-user-friends', label: 'Network', path: '/network' },
    { icon: 'fa-plus', label: 'Post', path: '/create' },
    { icon: 'fa-bell', label: 'Notifications', path: '/notifications' },
    { icon: 'fa-user', label: 'Profile', path: `/profile/${user?.username || ''}` },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              location.pathname === item.path
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <i className={`fas ${item.icon} text-lg mb-1`} />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
} 