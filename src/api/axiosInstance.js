import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: attach JWT ─────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 / 403 ──────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Token expired or invalid – clear storage and redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    } else if (status === 403) {
      // Authenticated but not authorised for this resource
      window.location.href = '/unauthorized';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
