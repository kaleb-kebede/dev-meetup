import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import WelcomePage from './pages/WelcomePage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import SearchPage from './pages/SearchPage';
import MessagingPage from './pages/MessagingPage';
import ThemeTest from './components/ThemeTest';
import DarkModeSummary from './components/DarkModeSummary';
import CreatePostPage from './pages/CreatePostPage';
import NetworkPage from './pages/NetworkPage';
import ProjectsPage from './pages/ProjectsPage';
import ChallengesPage from './pages/ChallengesPage';
import NotificationsPage from './pages/NotificationsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ThemeToggleButton from './components/ThemeToggleButton';

function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-lg border border-gray-200 dark:border-gray-600',
          duration: 4000,
        }}
      />
      
      {/* Routes */}
      <Routes>
        {/* Set up routes for logged-in users */}
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/profile/:username" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/profile/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
        <Route path="/create" element={<ProtectedRoute><CreatePostPage /></ProtectedRoute>} />
        <Route path="/network" element={<ProtectedRoute><NetworkPage /></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
        <Route path="/challenges" element={<ProtectedRoute><ChallengesPage /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />

        {/* Set up routes for logged-out users */}
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/messages" element={<ProtectedRoute><MessagingPage /></ProtectedRoute>} />
        <Route path="/theme-test" element={<DarkModeSummary />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:resettoken" element={<ResetPasswordPage />} />
      </Routes>

    </div>
  );
}

export default App;
