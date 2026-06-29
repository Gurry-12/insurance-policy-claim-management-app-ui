import axiosInstance from "../api/axiosInstance";
import { safeExtractPaginated } from "../utils/formatters";

export const getAllUsers = async (params = {}) => {
  const response = await axiosInstance.get("/users/page", { params });
  return safeExtractPaginated(response);
};

export const getUserById = async (userId) => {
  const response = await axiosInstance.get(`/users/${userId}`);
  return response.data?.data;
};

export const createStaff = async (payload) => {
  const response = await axiosInstance.post("/users/staff", payload);
  return response.data;
};

export const activateUser = async (userId) => {
  const response = await axiosInstance.patch(`/users/${userId}/activate`);
  return response.data;
};

export const deactivateUser = async (userId) => {
  const response = await axiosInstance.patch(`/users/${userId}/deactivate`);
  return response.data;
};

export default getAllUsers;