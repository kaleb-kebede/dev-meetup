import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Create the context
const ThemeContext = createContext();

// 2. Create the ThemeProvider component
export const ThemeProvider = ({ children }) => {
  // State to hold the current theme. We'll default to 'dark'.
  // We also check localStorage for a previously saved theme.
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  // This effect runs whenever the theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove the old theme class and add the new one
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);

    // Save the new theme preference to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Function to toggle the theme
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const value = {
    theme,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// 3. Create a custom hook for easy access to the context
export const useTheme = () => {
  return useContext(ThemeContext);
};
