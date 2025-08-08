import React, { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Modal from './Modal';

const CreatePostForm = ({ onPostCreated, isOpen, onClose }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [uploading, setUploading] = useState(false);

  console.log('CreatePostForm render - isOpen:', isOpen);

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submission started');
    console.log('Content:', content);
    
    if (!content.trim()) {
      toast.error('Post must have content.');
      return;
    }

    try {
      setUploading(true);

      // Prepare post data
      const postData = { 
        content: content.trim()
      };
      
      console.log('Sending post data:', postData);
      
      // Submit the post
      const response = await api.post('/posts', postData);
      console.log('Post created successfully:', response.data);

      if (onPostCreated) {
        onPostCreated(response.data);
      }
      
      toast.success('Post created successfully!');
      setContent('');
      onClose();

    } catch (error) {
      console.error('Post creation failed:', error);
      console.error('Error response:', error.response);
      const message = error.response?.data?.message || error.message || 'Failed to create post.';
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Create New Post</h2>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What's on your mind?
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Share your thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !content.trim()}
              className={`px-4 py-2 text-white rounded-md ${
                uploading || !content.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {uploading ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreatePostForm;
