import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import GitHubProfile from '../components/GitHubProfile';
import Header from '../components/Header';

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

  const handleGitHubUpdate = (updatedUser) => {
    updateUser(updatedUser);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mr-4">
                  <i className="fas fa-user-edit text-white"></i>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
              </div>
              
              <form onSubmit={onSubmit}>
                <div className="space-y-6">
                  {/* Profile Picture */}
                  <div>
                    <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Picture
                    </label>
                    <div className="flex items-center space-x-4">
                      <img 
                        src={user?.profileImageUrl || `https://placehold.co/80x80/1f2937/9ca3af?text=${user?.username?.charAt(0) || 'U'}`}
                        alt="Current profile"
                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                      />
                      <div className="flex-1">
                        <input
                          type="file"
                          id="imageFile"
                          name="imageFile"
                          onChange={handleFileChange}
                          accept="image/*"
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100 transition-colors duration-200"
                        />
                        <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF. Max size 5MB.</p>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea 
                      id="bio" 
                      name="bio" 
                      rows="4" 
                      value={formData.bio} 
                      onChange={onChange} 
                      placeholder="Tell others about yourself..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Skills */}
                  <div>
                    <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
                      Skills & Technologies
                    </label>
                    <input 
                      type="text" 
                      id="skills" 
                      name="skills" 
                      value={formData.skills} 
                      onChange={onChange} 
                      placeholder="JavaScript, React, Node.js, Python..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={uploading}
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 inline-block"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save mr-2"></i>
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(`/profile/${user.username}`)}
                      className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - GitHub Integration */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <i className="fab fa-github mr-2 text-gray-700"></i>
                  GitHub Integration
                </h2>
                <GitHubProfile 
                  user={user} 
                  onUpdate={handleGitHubUpdate}
                />
              </div>
              
              {/* Profile Preview */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                  <i className="fas fa-eye mr-2 text-cyan-600"></i>
                  Profile Preview
                </h3>
                <div className="text-center">
                  <img 
                    src={user?.profileImageUrl || `https://placehold.co/60x60/1f2937/9ca3af?text=${user?.username?.charAt(0) || 'U'}`}
                    alt="Profile preview"
                    className="w-15 h-15 rounded-full mx-auto mb-3 object-cover"
                  />
                  <h4 className="font-semibold text-gray-900">{user?.username}</h4>
                  {formData.bio && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-3">{formData.bio}</p>
                  )}
                  {formData.skills && (
                    <div className="flex flex-wrap gap-1 mt-3 justify-center">
                      {formData.skills.split(',').slice(0, 3).map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-cyan-100 text-cyan-800 text-xs rounded-full">
                          {skill.trim()}
                        </span>
                      ))}
                      {formData.skills.split(',').length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{formData.skills.split(',').length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
