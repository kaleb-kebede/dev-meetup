import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const EditProfilePage = () => {
  const { user, login } = useAuth(); // Get user and the login function to update context
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    bio: '',
    skills: '', // We'll handle skills as a comma-separated string
  });
  
  // When the component loads, pre-fill the form with the user's current data
  useEffect(() => {
    if (user) {
      setFormData({
        bio: user.bio || '',
        skills: user.skills ? user.skills.join(', ') : '',
      });
    }
  }, [user]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        bio: formData.bio,
        // Convert the comma-separated string back into an array
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(Boolean),
      };

      const response = await api.put('/users/profile', updatedData);
      
      // Update the user data in our AuthContext and localStorage
      login(response.data);

      // Redirect back to the profile page
      navigate(`/profile/${user.username}`);

    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <div className="h-full flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-4xl font-bold text-cyan-400 mb-6 text-center">
          Edit Profile
        </h1>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label htmlFor="bio" className="block text-gray-300 mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows="4"
              value={formData.bio}
              onChange={onChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            ></textarea>
          </div>
          <div className="mb-6">
            <label htmlFor="skills" className="block text-gray-300 mb-2">
              Skills (comma separated)
            </label>
            <input
              type="text"
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={onChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
