import React, { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Modal from './Modal';

const CreatePostForm = ({ onPostCreated, isOpen, onClose }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // --- FIX: Construct the full image URL ---
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const getFullImageUrl = (path) => {
    if (!path) return null;
    return `${API_BASE_URL.replace('/api', '')}${path}`;
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('Post content cannot be empty.');
      return;
    }

    try {
      setUploading(true);
      let imageUrl = '';

      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('image', imageFile);
        const uploadResponse = await api.post('/upload', uploadFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        imageUrl = uploadResponse.data.image;
      }

      const postData = { content, imageUrl };
      const response = await api.post('/posts', postData);

      if (onPostCreated) {
        onPostCreated(response.data);
      }
      
      toast.success('Post created successfully!');
      setContent('');
      setImageFile(null);
      onClose();

    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create post.';
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex items-center mb-4">
        <img 
          src={getFullImageUrl(user?.profileImageUrl) || `https://placehold.co/48x48/1f2937/9ca3af?text=${user?.username.charAt(0)}`} 
          alt="Your profile" 
          className="w-12 h-12 rounded-full mr-4"
        />
        <div>
          <p className="font-bold text-white">{user?.username}</p>
          <p className="text-sm text-gray-400">Post to Anyone</p>
        </div>
      </div>

      <form onSubmit={onSubmit}>
        <textarea
          className="w-full p-2 bg-transparent text-white text-lg placeholder-gray-400 focus:outline-none"
          rows="6"
          placeholder="What do you want to talk about?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>
        
        <div className="flex items-center justify-between mt-4">
          <div>
            <label htmlFor="postImageFileModal" className="cursor-pointer text-gray-400 hover:text-cyan-400 p-2 rounded-full text-2xl">
              📷
            </label>
            <input
              type="file"
              id="postImageFileModal"
              className="hidden"
              onChange={handleFileChange}
            />
            {imageFile && <span className="text-sm text-gray-400 ml-2">{imageFile.name}</span>}
          </div>
          <button
            type="submit"
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-full transition duration-300 disabled:bg-gray-600"
            disabled={uploading || !content.trim()}
          >
            {uploading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreatePostForm;
