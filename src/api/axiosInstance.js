import axios from 'axios';
import NProgress from 'nprogress';

import { parseSuccessResponse, parseErrorResponse } from './apiAdapter';

NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.1 });

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use(
  (config) => {
    NProgress.start();
    // Let the browser set Content-Type with boundary for FormData
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    const token = localStorage.getItem('ss_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    NProgress.done();
    return parseSuccessResponse(response);
  },
  (error) => {
    NProgress.done();
    const status = error.response?.status;
    if (status === 401) {
      localStorage.removeItem('ss_token');
      localStorage.removeItem('ss_user');
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    } else if (status === 403) {
      window.dispatchEvent(new CustomEvent('auth:forbidden'));
    } else if (status >= 500 || !error.response) {
      window.dispatchEvent(new CustomEvent('api:error', { detail: parseErrorResponse(error).message }));
    }
    return Promise.reject(parseErrorResponse(error));
  }
);

export default axiosInstance;
