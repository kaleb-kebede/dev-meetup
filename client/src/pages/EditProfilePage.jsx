import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const EditProfilePage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    bio: '',
    skills: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

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
  
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = user.profileImageUrl;

      if (imageFile) {
        setUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append('image', imageFile);
        const uploadResponse = await api.post('/upload', uploadFormData);
        imageUrl = uploadResponse.data.image;
        setUploading(false);
      }

      const updatedTextData = {
        bio: formData.bio,
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(Boolean),
      };

      const textDataPromise = api.put('/users/profile', updatedTextData);
      const imageDataPromise = api.put('/users/profile/picture', { imageUrl });

      const [textResponse, imageResponse] = await Promise.all([textDataPromise, imageDataPromise]);
      
      const finalUserData = { ...textResponse.data, ...imageResponse.data };

      updateUser(finalUserData);

      toast.success('Profile updated successfully!');
      navigate(`/profile/${user.username}`);

    } catch (error) {
      setUploading(false);
      toast.error('Failed to update profile.');
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <div className="h-full flex items-center justify-center">
      {/* --- THEME UPDATE --- */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-4xl font-bold text-cyan-500 dark:text-cyan-400 mb-6 text-center">
          Edit Profile
        </h1>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label htmlFor="imageFile" className="block text-gray-600 dark:text-gray-300 mb-2">
              Change Profile Picture
            </label>
            <input
              type="file"
              id="imageFile"
              name="imageFile"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-100 dark:file:bg-cyan-900 file:text-cyan-700 dark:file:text-cyan-300 hover:file:bg-cyan-200 dark:hover:file:bg-cyan-800"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="bio" className="block text-gray-600 dark:text-gray-300 mb-2">Bio</label>
            <textarea 
              id="bio" 
              name="bio" 
              rows="4" 
              value={formData.bio} 
              onChange={onChange} 
              className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="skills" className="block text-gray-600 dark:text-gray-300 mb-2">Skills (comma separated)</label>
            <input 
              type="text" 
              id="skills" 
              name="skills" 
              value={formData.skills} 
              onChange={onChange} 
              className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
