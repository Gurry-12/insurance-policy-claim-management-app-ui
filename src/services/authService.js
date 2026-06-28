import axiosInstance from '../api/axiosInstance';
import { jwtDecode } from 'jwt-decode';

export const login = async (credentials) => {
  const { data } = await axiosInstance.post('/auth/login', credentials);
  const decoded = jwtDecode(data.token);

  const user = {
    id: data.userId,
    email: data.email || decoded.sub,
    role: data.role || (decoded.role ?? decoded.roles?.[0] ?? null),
    name: data.fullName || (decoded.fullName ?? decoded.name ?? decoded.sub),
  };

  return { token: data.token, user };
};

export const register = async (userData) => {
  const { data } = await axiosInstance.post('/auth/register', userData);
  return data;
};

export const verifyOtpApi = async (payload) => {
  const { data } = await axiosInstance.post('/auth/verify-otp', payload);
  return data.success;
};

export const resendOtpApi = async (payload) => {
  const { data } = await axiosInstance.post('/auth/resend-otp', payload);
  return data.success;
};

export const forgotPasswordApi = async (payload) => {
  const { data } = await axiosInstance.post('/auth/forgot-password', payload);
  return data;
};

export const resetPasswordApi = async (payload) => {
  const { data } = await axiosInstance.post('/auth/reset-password', payload);
  return data;
};

