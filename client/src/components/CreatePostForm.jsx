import React, { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const CreatePostForm = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // 1. Add new state for the image URL

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('Post content cannot be empty.');
      return;
    }

    try {
      // 2. Include both content and imageUrl in the data sent to the backend
      const postData = { content, imageUrl };
      const response = await api.post('/posts', postData);

      if (onPostCreated) {
        onPostCreated(response.data);
      }
      
      toast.success('Post created successfully!');
      setContent(''); // Clear the form fields
      setImageUrl('');
      
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create post.';
      toast.error(message);
      console.error('Failed to create post:', message);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-8">
      <form onSubmit={onSubmit}>
        <textarea
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          rows="3"
          placeholder="What's on your mind, developer?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>
        {/* 3. Add the new input field for the image URL */}
        <input
          type="url"
          className="w-full p-2 mt-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          placeholder="Optional: Image URL (e.g., https://...)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePostForm;
