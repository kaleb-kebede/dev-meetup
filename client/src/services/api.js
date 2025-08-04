import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

// This is an Axios interceptor. It's a function that runs
// before every single request is sent by this api instance.
api.interceptors.request.use(
  (config) => {
    // 1. Get the user data from localStorage.
    const user = JSON.parse(localStorage.getItem("user"));

    // 2. If the user and their token exist...
    if (user && user.token) {
      // 3. ...add an 'Authorization' header to the request.
      // The format "Bearer [token]" is a standard convention.
      config.headers["Authorization"] = `Bearer ${user.token}`;
    }

    // 4. Return the modified request configuration.
    return config;
  },
  (error) => {
    // If there's an error setting up the request, reject the promise.
    return Promise.reject(error);
  }
);


// Direct Messaging API
export const getMessages = async (otherUserId) => {
  try {
    const res = await api.get(`/messages/${otherUserId}`);
    return res.data;
  } catch (err) {
    console.error('Error fetching messages:', err);
    throw new Error(err.response?.data?.error || 'Failed to fetch messages');
  }
};

export const sendMessage = async (receiverId, content) => {
  try {
    const res = await api.post('/messages', { receiver: receiverId, content });
    return res.data;
  } catch (err) {
    console.error('Error sending message:', err);
    throw new Error(err.response?.data?.error || 'Failed to send message');
  }
};

export default api;
