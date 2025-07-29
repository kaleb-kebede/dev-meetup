import React, { useState } from 'react';
import api from '../services/api';

// 1. Accept a new prop called `onPostCreated`
const CreatePostForm = ({ onPostCreated }) => {
  const [content, setContent] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return; // Prevent empty posts

    try {
      const postData = { content };
      const response = await api.post('/posts', postData);

      // 2. If the prop exists, call it with the new post data from the backend
      if (onPostCreated) {
        onPostCreated(response.data);
      }
      
      setContent(''); // Clear the form
      
    } catch (error) {
      console.error('Failed to create post:', error.response?.data?.message || error.message);
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
