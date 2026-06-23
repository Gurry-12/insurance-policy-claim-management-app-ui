import axios from 'axios';

console.log("API URL =", import.meta.env.VITE_API_BASE_URL);

const axiosInstance = axios.create({
  baseURL: "http://localhost:8081/api",
  // baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ss_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      localStorage.removeItem('ss_token');
      localStorage.removeItem('ss_user');
      window.location.href = '/login';
    } else if (status === 403) {
      window.location.href = '/unauthorized';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
