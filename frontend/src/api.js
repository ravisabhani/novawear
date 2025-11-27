import axios from 'axios';

// Vite injects VITE_API_URL at build time. If it wasn't set when the app
// was built (e.g. deployed without the env), fall back to a runtime-safe
// value so the live site still contacts the Render backend.
// Priority order (most to least):
// 1. import.meta.env.VITE_API_URL (build-time env)
// 2. window.__NOVAWEAR_API_URL (optional runtime override if you inject it)
// 3. hard-coded production API URL (final fallback)
// Allow an explicit runtime override to take precedence even when the app
// was built with a VITE_API_URL value (e.g. a local dev value baked into
// the build). That way we can fix a live deployment quickly by setting
// window.__NOVAWEAR_API_URL in the page (Vercel or a small script) without
// rebuilding.
const RUNTIME_OVERRIDE = typeof window !== 'undefined' && window.__NOVAWEAR_API_URL;
const HARDCODED_FALLBACK = 'https://novawear-giim.onrender.com/api';

// Priority: runtime override -> build-time VITE_API_URL -> hard-coded fallback
const baseURL = RUNTIME_OVERRIDE || import.meta.env.VITE_API_URL || HARDCODED_FALLBACK;

const api = axios.create({
  baseURL,
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

