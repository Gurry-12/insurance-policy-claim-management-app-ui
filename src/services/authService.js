import axiosInstance from '../api/axiosInstance';
import { jwtDecode } from 'jwt-decode';

export const login = async (credentials) => {
  const { data } = await axiosInstance.post('/auth/login', credentials);
  const decoded = jwtDecode(data.token);

  const user = {
    email: decoded.sub,
    role: decoded.role ?? decoded.roles?.[0] ?? null,
    name: decoded.name ?? decoded.fullName ?? decoded.sub,
  };

  return { token: data.token, user };
};

export const register = async (userData) => {
  const { data } = await axiosInstance.post('/auth/register', userData);
  return data;
};

export const verifyOtpApi = async (payload) => {
  const {data} = await axiosInstance.post('auth/verfy-otp', payload);
  return data.success;
}

export const resendOtpApi = async (payload) => {
  const {data} = await axiosInstance.post('auth/resend-otp' , payload);
  return data.success;
}
