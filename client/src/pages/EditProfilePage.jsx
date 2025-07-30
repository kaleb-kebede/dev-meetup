import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast'; // 1. Import toast

const EditProfilePage = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    bio: '',
    skills: '',
    profileImageUrl: '',
  });
  
  useEffect(() => {
    if (user) {
      setFormData({
        bio: user.bio || '',
        skills: user.skills ? user.skills.join(', ') : '',
        profileImageUrl: user.profileImageUrl || '',
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
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(Boolean),
        profileImageUrl: formData.profileImageUrl,
      };

      const textDataPromise = api.put('/users/profile', { bio: updatedData.bio, skills: updatedData.skills });
      const imageDataPromise = api.put('/users/profile/picture', { imageUrl: updatedData.profileImageUrl });

      const [textResponse, imageResponse] = await Promise.all([textDataPromise, imageDataPromise]);
      
      const finalUserData = { ...user, ...textResponse.data, ...imageResponse.data };

      login(finalUserData);

      // 2. Show a success notification
      toast.success('Profile updated successfully!');

      navigate(`/profile/${user.username}`);

    } catch (error) {
      // 3. Show an error notification
      const message = error.response?.data?.message || 'Failed to update profile.';
      toast.error(message);
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
            <label htmlFor="profileImageUrl" className="block text-gray-300 mb-2">
              Profile Picture URL
            </label>
            <input
              type="url"
              id="profileImageUrl"
              name="profileImageUrl"
              value={formData.profileImageUrl}
              onChange={onChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
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
