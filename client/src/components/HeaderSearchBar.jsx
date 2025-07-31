import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeaderSearchBar = () => {
  const navigate = useNavigate();

  // This function will navigate to the search page when the component is clicked
  const goToSearchPage = () => {
    navigate('/search');
  };

  return (
    <div 
      onClick={goToSearchPage} 
      className="relative cursor-pointer"
      title="Go to search page"
    >
      {/* Search Icon */}
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
      </div>
      {/* Fake input field */}
      <div 
        className="block w-full bg-gray-200 dark:bg-gray-700 py-2 pl-10 pr-3 rounded-md text-gray-500 dark:text-gray-400 text-sm"
      >
        Search
      </div>
    </div>
  );
};

export default HeaderSearchBar;
