import React from 'react';
import Header from './Header';
import MobileNav from './MobileNav';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Layout({ 
  children, 
  title = "DevMeetup", 
  showMobileNav = true,
  breadcrumbs = null,
  className = ""
}) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20'}`}>
      {/* Header with navigation */}
      <Header />
      
      {/* Breadcrumb Navigation */}
      {breadcrumbs && (
        <div className={`border-b backdrop-blur-sm ${
          isDarkMode 
            ? 'bg-gray-900/95 border-gray-700/50' 
            : 'bg-white/95 border-gray-200/50'
        }`}>
          <div className="max-w-7xl mx-auto px-4 py-3">
            <nav className="flex items-center space-x-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  {index > 0 && (
                    <svg className={`w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  {crumb.href ? (
                    <a 
                      href={crumb.href} 
                      className={`hover:underline transition-colors duration-200 ${
                        isDarkMode 
                          ? 'text-blue-400 hover:text-blue-300' 
                          : 'text-blue-600 hover:text-blue-700'
                      }`}
                    >
                      {crumb.icon && <i className={`${crumb.icon} mr-1`}></i>}
                      {crumb.label}
                    </a>
                  ) : (
                    <span className={`${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    } font-medium`}>
                      {crumb.icon && <i className={`${crumb.icon} mr-1`}></i>}
                      {crumb.label}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </div>
        </div>
      )}
      
      {/* Page Title Bar */}
      {title !== "DevMeetup" && (
        <div className={`border-b backdrop-blur-sm ${
          isDarkMode 
            ? 'bg-gray-800/95 border-gray-700/50' 
            : 'bg-white/95 border-gray-200/50'
        }`}>
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full`}></div>
                <h1 className={`text-2xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {title}
                </h1>
              </div>
              
              {/* Quick Home Navigation */}
              <a 
                href="/" 
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                  isDarkMode
                    ? 'text-blue-400 hover:bg-blue-900/20 hover:text-blue-300'
                    : 'text-blue-600 hover:bg-blue-50 hover:text-blue-700'
                } group`}
                title="Return to Homepage"
              >
                <i className="fas fa-home text-sm group-hover:scale-110 transition-transform"></i>
                <span className="hidden sm:inline text-sm font-medium">Home</span>
              </a>
            </div>
          </div>
        </div>
      )}
      
      {/* Main content */}
      <main className={`${className}`}>
        {children}
      </main>
      
      {/* Mobile Navigation */}
      {showMobileNav && user && <MobileNav />}
      
      {/* Floating Action Button for Quick Navigation (Mobile) */}
      <div className="fixed bottom-20 right-4 md:hidden z-40">
        <a 
          href="/" 
          className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95"
          title="Quick Home"
        >
          <i className="fas fa-home text-lg"></i>
        </a>
      </div>
    </div>
  );
}
