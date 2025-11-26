import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach token automatically from localStorage so protected requests work
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('novawear_token');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // ignore
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

