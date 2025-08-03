import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeTest = () => {
  const { theme, toggleTheme, setTheme } = useTheme();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Tailwind CSS v4.1 Dark Mode Test
        </h2>
        
        <div className="space-y-6">
          {/* Theme Status */}
          <div className="p-6 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl border border-cyan-200 dark:border-cyan-800">
            <h3 className="text-xl font-semibold text-cyan-900 dark:text-cyan-100 mb-3">
              Current Theme Status
            </h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-4 h-4 rounded-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-yellow-400'}`}></div>
                <span className="text-gray-700 dark:text-gray-300">
                  Current: <span className="font-bold text-cyan-600 dark:text-cyan-400">{theme}</span>
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Using Tailwind CSS v4.1 with @config directive
              </div>
            </div>
          </div>
          
          {/* Color Palette Test */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Light Mode Colors</h3>
              <div className="space-y-2">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-blue-700 dark:text-blue-300">Blue accent colors</p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-green-700 dark:text-green-300">Green accent colors</p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <p className="text-purple-700 dark:text-purple-300">Purple accent colors</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Dark Mode Colors</h3>
              <div className="space-y-2">
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="text-red-700 dark:text-red-300">Red accent colors</p>
                </div>
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <p className="text-yellow-700 dark:text-yellow-300">Yellow accent colors</p>
                </div>
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                  <p className="text-indigo-700 dark:text-indigo-300">Indigo accent colors</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Theme Controls */}
          <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Theme Controls</h3>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={toggleTheme}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Toggle Theme
              </button>
              <button
                onClick={() => setTheme('light')}
                className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Force Light
              </button>
              <button
                onClick={() => setTheme('dark')}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Force Dark
              </button>
            </div>
          </div>
          
          {/* Features List */}
          <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-4">Tailwind CSS v4.1 Features</h3>
            <ul className="space-y-2 text-green-700 dark:text-green-300">
              <li className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Class-based dark mode with @config directive</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>System preference detection</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Persistent theme storage</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Smooth transitions and animations</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Custom scrollbar styling</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeTest; 