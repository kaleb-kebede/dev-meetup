import React, { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Modal from './Modal';
import CodeSnippetForm from './CodeSnippetForm';

const CreatePostForm = ({ onPostCreated, isOpen, onClose }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState({
    code: '',
    language: 'javascript',
    title: ''
  });

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const getFullImageUrl = (path) => {
    if (!path) return null;
    return `${API_BASE_URL.replace('/api', '')}${path}`;
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleCodeSnippetChange = (newCodeSnippet) => {
    setCodeSnippet(newCodeSnippet);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !codeSnippet.code.trim() && !imageFile) {
      toast.error('Post must have content, code snippet, or image.');
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

      const postData = { 
        content, 
        imageUrl,
        codeSnippet: codeSnippet.code.trim() ? codeSnippet : null
      };
      const response = await api.post('/posts', postData);

      if (onPostCreated) {
        onPostCreated(response.data);
      }
      
      toast.success('Post created successfully!');
      setContent('');
      setImageFile(null);
      setCodeSnippet({ code: '', language: 'javascript', title: '' });
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <img 
            src={getFullImageUrl(user?.profileImageUrl) || `https://placehold.co/48x48/1f2937/9ca3af?text=${user?.username.charAt(0)}`} 
            alt="Your profile" 
            className="w-12 h-12 rounded-full ring-2 ring-cyan-500/20"
          />
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.username}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Share with the community</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Content Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              What's on your mind?
            </label>
            <textarea
              className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-200 resize-none"
              rows="4"
              placeholder="Share your thoughts, code, or discoveries..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          
          {/* Code Snippet Form */}
          <CodeSnippetForm 
            codeSnippet={codeSnippet}
            onCodeSnippetChange={handleCodeSnippetChange}
          />
          
          {/* Image Upload */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Add Image (Optional)
            </label>
            <div className="flex items-center space-x-4">
              <label htmlFor="postImageFileModal" className="cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 p-3 rounded-xl border border-gray-200 dark:border-gray-600 transition-all duration-200 hover:border-cyan-500/50">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </label>
              <input
                type="file"
                id="postImageFileModal"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
              {imageFile && (
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{imageFile.name}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={uploading || (!content.trim() && !codeSnippet.code.trim() && !imageFile)}
            >
              {uploading ? (
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Posting...</span>
                </div>
              ) : (
                'Post'
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreatePostForm;
