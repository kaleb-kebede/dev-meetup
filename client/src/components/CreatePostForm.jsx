import React, { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const CreatePostForm = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null); // 1. State for the image file
  const [uploading, setUploading] = useState(false);

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

      // 2. If a file was selected, upload it first
      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('image', imageFile);

        const uploadResponse = await api.post('/upload', uploadFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        
        imageUrl = uploadResponse.data.image; // Get the new image path
      }

      // 3. Create the post with the new image URL
      const postData = { content, imageUrl };
      const response = await api.post('/posts', postData);

      if (onPostCreated) {
        onPostCreated(response.data);
      }
      
      toast.success('Post created successfully!');
      setContent('');
      setImageFile(null); // Clear the file input
      // This is a common trick to reset a file input
      document.getElementById('postImageFile').value = null;

    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create post.';
      toast.error(message);
      console.error('Failed to create post:', message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-8">
      <form onSubmit={onSubmit}>
        <textarea
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          rows="3"
          placeholder="What's on your mind, developer?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>
        
        {/* 4. Changed the input from 'url' to 'file' */}
        <div className="mt-2">
          <label htmlFor="postImageFile" className="text-sm text-gray-400">Add an image (optional):</label>
          <input
            type="file"
            id="postImageFile"
            name="imageFile"
            onChange={handleFileChange}
            className="w-full mt-1 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
          />
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            disabled={uploading}
          >
            {uploading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePostForm;
