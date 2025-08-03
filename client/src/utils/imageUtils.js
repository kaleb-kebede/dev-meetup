// Utility function to get the full URL for profile images
export const getProfileImageUrl = (profileImageUrl, username) => {
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  if (!profileImageUrl) {
    // Return a placeholder image with the user's initial
    return `https://placehold.co/48x48/1f2937/9ca3af?text=${username?.charAt(0) || 'U'}`;
  }
  
  // If the URL is already a full URL, return it as is
  if (profileImageUrl.startsWith('http://') || profileImageUrl.startsWith('https://')) {
    return profileImageUrl;
  }
  
  // If it's a relative path, construct the full URL
  const baseUrl = API_BASE_URL.replace('/api', '');
  return `${baseUrl}${profileImageUrl}`;
};

// Utility function to get the full URL for post images
export const getPostImageUrl = (imageUrl) => {
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  if (!imageUrl) {
    return null;
  }
  
  // If the URL is already a full URL, return it as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If it's a relative path, construct the full URL
  const baseUrl = API_BASE_URL.replace('/api', '');
  return `${baseUrl}${imageUrl}`;
}; 