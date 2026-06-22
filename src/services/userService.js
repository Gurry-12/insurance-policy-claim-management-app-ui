import axiosInstance from "../api/axiosInstance";
import { safeExtractArray } from "../utils/formatters";

export const getAllUsers = async () => {
  const response = await axiosInstance.get("/users");
  return safeExtractArray(response);
};

export const getUserById = async (userId) => {
  const response = await axiosInstance.get(`/users/${userId}`);
  return response.data?.data;
};

export const createAgent = async (payload) => {
  const response = await axiosInstance.post("/users/agent", payload);
  return response.data;
};

export const activateUser = async (userId) => {
  const response = await axiosInstance.put(`/users/${userId}/activate`);
  return response.data;
};

export const deactivateUser = async (userId) => {
  const response = await axiosInstance.put(`/users/${userId}/deactivate`);
  return response.data;
};

export default getAllUsers;