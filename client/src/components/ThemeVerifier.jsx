import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeVerifier = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-yellow-400'}`}></div>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {theme}
          </span>
          <button
            onClick={toggleTheme}
            className="px-2 py-1 bg-cyan-500 hover:bg-cyan-600 text-white text-xs rounded transition-colors"
          >
            Toggle
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThemeVerifier; 