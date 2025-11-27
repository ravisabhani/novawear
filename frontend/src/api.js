import axios from 'axios';

// Resolve API base at runtime so deployed bundles can be corrected without
// requiring a rebuild when VITE_API_URL was set incorrectly at build-time.
// Priority order (most to least):
// 1. runtime override: window.__NOVAWEAR_API_URL (settable on the page)
// 2. build-time Vite env: import.meta.env.VITE_API_URL
// 3. hard-coded safe fallback: Render API
const RENDER_FALLBACK = 'https://novawear-giim.onrender.com/api';

function resolveApiBase() {
  try {
    // runtime override (highest priority) - respected even if VITE_API_URL was set
    if (typeof window !== 'undefined' && window.__NOVAWEAR_API_URL) {
      return window.__NOVAWEAR_API_URL;
    }

    // If Vite injected a VITE_API_URL at build-time, it's used next. However
    // avoid using obviously-local values in production (e.g. localhost) — treat
    // them as absent so the fallback wins.
    const buildUrl = import.meta.env.VITE_API_URL;
    // Treat build-time values that are obviously local or relative as absent so
    // the runtime override or the safe Render fallback will be used. This
    // prevents bundles built with an incorrect VITE_API_URL (e.g. empty
    // string or "/") from issuing relative requests in production.
    if (
      buildUrl &&
      !/localhost|127\.0\.0\.1/.test(buildUrl) &&
      !/^\s*\/.*/.test(buildUrl)
    ) {
      return buildUrl;
    }
  } catch (e) {
    // noop - fall through to final fallback
  }

  return RENDER_FALLBACK;
}

const baseURL = resolveApiBase();

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

// Helpful debug log so we can see which base was chosen inside a customer's
// browser console (safely runs only in browsers).
if (typeof window !== 'undefined' && window.console && window.console.info) {
  try {
    console.info('[NovaWear] API base URL:', baseURL);
  } catch {}
}

