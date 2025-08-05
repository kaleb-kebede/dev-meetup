import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { login } = useAuth();

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = { email: formData.email, password: formData.password };
      const response = await api.post('/auth/login', userData);
      login(response.data);
      toast.success('Successfully logged in!');
      navigate('/home'); // Redirect to /home after login
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
    }
  };

  return (
    <div className="h-full flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-cyan-500 dark:text-cyan-400">Welcome Back!</h1>
            <p className="text-gray-500 dark:text-gray-400">Sign in to continue to Dev Meetup</p>
        </div>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600 dark:text-gray-300 mb-2 font-semibold">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              required
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400"
            />
          </div>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-gray-600 dark:text-gray-300 font-semibold">Password</label>
                {/* --- NEW: Forgot Password Link --- */}
                <Link to="/forgot-password" className="text-sm text-cyan-500 dark:text-cyan-400 hover:underline">Forgot Password?</Link>
            </div>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={onChange}
              required
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 text-lg"
          >
            Log In
          </button>
        </form>
        <p className="text-center text-gray-500 dark:text-gray-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-cyan-500 dark:text-cyan-400 hover:underline font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
