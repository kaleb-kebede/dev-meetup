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

export default api;
