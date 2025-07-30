import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const EditProfilePage = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    bio: '',
    skills: '',
  });
  // 1. New state to hold the selected image file
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
  
  // 2. New handler for the file input
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]); // Get the first selected file
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = user.profileImageUrl; // Start with the existing image URL

      // 3. If a new file was selected, upload it first
      if (imageFile) {
        setUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append('image', imageFile); // 'image' must match the fieldname in upload.js

        // Send the file to our /api/upload endpoint
        const uploadResponse = await api.post('/upload', uploadFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        
        imageUrl = uploadResponse.data.image; // Get the new image path from the server
        setUploading(false);
      }

      const updatedTextData = {
        bio: formData.bio,
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(Boolean),
      };

      // 4. Update the profile with the new text data and image URL
      const textDataPromise = api.put('/users/profile', updatedTextData);
      const imageDataPromise = api.put('/users/profile/picture', { imageUrl });

      const [textResponse, imageResponse] = await Promise.all([textDataPromise, imageDataPromise]);
      
      const finalUserData = { ...user, ...textResponse.data, ...imageResponse.data };

      login(finalUserData);
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
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-4xl font-bold text-cyan-400 mb-6 text-center">
          Edit Profile
        </h1>
        <form onSubmit={onSubmit}>
          {/* 5. Changed the input from 'url' to 'file' */}
          <div className="mb-4">
            <label htmlFor="imageFile" className="block text-gray-300 mb-2">
              Change Profile Picture
            </label>
            <input
              type="file"
              id="imageFile"
              name="imageFile"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="bio" className="block text-gray-300 mb-2">Bio</label>
            <textarea id="bio" name="bio" rows="4" value={formData.bio} onChange={onChange} className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"/>
          </div>
          <div className="mb-6">
            <label htmlFor="skills" className="block text-gray-300 mb-2">Skills (comma separated)</label>
            <input type="text" id="skills" name="skills" value={formData.skills} onChange={onChange} className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"/>
          </div>
          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            disabled={uploading} // Disable button while uploading
          >
            {uploading ? 'Uploading...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
