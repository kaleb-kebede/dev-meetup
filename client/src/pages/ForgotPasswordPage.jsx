import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/forgotpassword', { email });
      toast.success('Password reset token generated!');
      setIsSubmitted(true);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send reset token.';
      toast.error(message);
    }
  };

  return (
    <div className="h-full flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-cyan-500 dark:text-cyan-400 mb-6 text-center">
          Forgot Password
        </h1>
        {isSubmitted ? (
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300">
              A password reset token has been generated and logged to the server console.
            </p>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
              (In a real application, this would be sent to your email.)
            </p>
            <Link to="/login" className="text-cyan-500 dark:text-cyan-400 hover:underline mt-4 inline-block">
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Enter your email address and we will send you a token to reset your password.
            </p>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-600 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
              Send Reset Token
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
