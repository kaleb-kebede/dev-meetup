import React from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import SearchPage from './pages/SearchPage';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ThemeToggleButton from './components/ThemeToggleButton';
import HeaderSearchBar from './components/HeaderSearchBar'; // 1. Import the new component

function App() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white flex flex-col transition-colors duration-200">
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white',
        }}
      />
      <nav className="bg-white dark:bg-gray-800 p-4 shadow-md sticky top-0 z-40">
        <div className="container mx-auto flex justify-between items-center gap-4">
          <Link to="/" className="text-xl font-bold text-cyan-500 dark:text-cyan-400">Dev Meetup</Link>
          
          {/* 2. Add the search bar to the middle of the nav */}
          <div className="flex-1 max-w-xs">
            {user && <HeaderSearchBar />}
          </div>

          <div className="space-x-4 flex items-center">
            {user ? (
              <>
                {location.pathname !== '/' && (
                  <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-400">Home</Link>
                )}
                {/* The text search link has been replaced by the search bar */}
                {location.pathname !== `/profile/${user.username}` && (
                  <Link to={`/profile/${user.username}`} className="text-gray-600 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-400">
                    Profile
                  </Link>
                )}
                <button 
                  onClick={handleLogout} 
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-400">Login</Link>
                <Link to="/register" className="text-gray-600 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-400">Register</Link>
              </>
            )}
            <ThemeToggleButton />
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/profile/:username" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/profile/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
