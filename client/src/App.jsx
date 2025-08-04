import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import SearchPage from './pages/SearchPage';
import MessagingPage from './pages/MessagingPage';
import ThemeTest from './components/ThemeTest';
import DarkModeSummary from './components/DarkModeSummary';
import ThemeVerifier from './components/ThemeVerifier';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ThemeToggleButton from './components/ThemeToggleButton';

function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 transition-colors duration-200">
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'bg-white text-gray-900 shadow-lg border border-gray-200',
          duration: 4000,
        }}
      />
      
      {/* Routes */}
      <Routes>
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/profile/:username" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/profile/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><MessagingPage /></ProtectedRoute>} />
        <Route path="/theme-test" element={<DarkModeSummary />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>

      {/* Theme Verifier - Temporary for testing */}
      <ThemeVerifier />
    </div>
  );
}

export default App;
