import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner'; // We'll show a spinner while checking auth

const ProtectedRoute = ({ children }) => {
  // 1. Get the user and the new loading state from the context
  const { user, loading } = useAuth();

  // 2. If it's still loading, show a spinner and wait
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // 3. If it's done loading and there's no user, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // 4. If it's done loading and there is a user, show the page
  return children;
};

export default ProtectedRoute;
