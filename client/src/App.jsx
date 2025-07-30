import React from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // 1. Import the Toaster component
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import SearchPage from './pages/SearchPage';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white flex flex-col">
      {/* 2. Add the Toaster component here. It can go anywhere in the main div. */}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#334155', // bg-slate-700
            color: '#fff',
          },
        }}
      />
      <nav className="bg-gray-800 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-cyan-400">Dev Meetup</Link>
          <div className="space-x-4 flex items-center">
            {user ? (
              <>
                {location.pathname !== '/' && (
                  <Link to="/" className="hover:text-cyan-400">Home</Link>
                )}
                <Link to="/search" className="hover:text-cyan-400">Search</Link>
                {location.pathname !== `/profile/${user.username}` && (
                  <Link to={`/profile/${user.username}`} className="hover:text-cyan-400">
                    Profile
                  </Link>
                )}
                <button 
                  onClick={handleLogout} 
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-cyan-400">Login</Link>
                <Link to="/register" className="hover:text-cyan-400">Register</Link>
              </>
            )}
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
