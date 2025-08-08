import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MobileNav() {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = [
    { icon: 'fa-terminal', label: 'Feed', path: '/', primary: true },
    { icon: 'fa-code-branch', label: 'Projects', path: '/projects' },
    { icon: 'fa-plus', label: 'Create', path: '/create', highlight: true },
    { icon: 'fa-comments', label: 'Chat', path: '/messages' },
    { icon: 'fa-user', label: 'Profile', path: `/profile/${user?.username || ''}` },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50 backdrop-blur-md bg-white/95 dark:bg-gray-900/95">
      {/* Safety padding for devices with home indicators */}
      <div className="pb-safe">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path === '/' && (location.pathname === '/home' || location.pathname === '/'));
            
            return (
              <Link
                key={item.path}
                to={item.path}
                title={`Go to ${item.label}`}
                className={`relative flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-300 transform ${
                  isActive
                    ? item.primary 
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 scale-105'
                      : 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                    : item.highlight
                      ? 'text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
                      : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                } hover:scale-105 active:scale-95`}
              >
                {/* Special styling for home/primary button */}
                {item.primary && (
                  <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-br from-blue-500/10 to-indigo-500/10 ring-2 ring-blue-500/20'
                      : 'hover:bg-gradient-to-br hover:from-blue-500/5 hover:to-indigo-500/5'
                  }`}></div>
                )}
                
                {/* Special styling for highlight button (create) */}
                {item.highlight && !isActive && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-500/5 to-emerald-500/5 hover:from-green-500/10 hover:to-emerald-500/10 transition-all duration-300"></div>
                )}
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className={`mb-1 transition-transform duration-200 ${
                    isActive ? 'scale-110' : 'group-hover:scale-105'
                  }`}>
                    <i className={`fas ${item.icon} ${
                      item.primary && isActive
                        ? 'text-xl'
                        : item.highlight && !isActive 
                          ? 'text-lg text-green-600 dark:text-green-400'
                          : 'text-lg'
                    }`} />
                  </div>
                  <span className={`text-xs font-medium transition-colors duration-200 ${
                    isActive 
                      ? item.primary
                        ? 'text-blue-700 dark:text-blue-300 font-semibold'
                        : 'font-semibold'
                      : ''
                  }`}>
                    {item.label}
                  </span>
                </div>
                
                {/* Active indicator */}
                {isActive && (
                  <div className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 ${
                    item.primary ? 'bg-blue-500' : 'bg-blue-400'
                  } rounded-full`}></div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
} 