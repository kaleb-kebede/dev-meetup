import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Create the context
const AuthContext = createContext(null);

// 2. Create the AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // useEffect runs when the component mounts.
  // We'll use it to check if user data exists in localStorage.
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Function to handle user login
  const login = (userData) => {
    // Save user data to localStorage to persist the session
    localStorage.setItem('user', JSON.stringify(userData));
    // Update the user state
    setUser(userData);
  };

  // Function to handle user logout
  const logout = () => {
    // Remove user data from localStorage
    localStorage.removeItem('user');
    // Reset the user state
    setUser(null);
  };

  // The value provided to the context consumers
  const value = {
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Create a custom hook for easy access to the context
export const useAuth = () => {
  return useContext(AuthContext);
};
