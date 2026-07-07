import axiosInstance from "../api/axiosInstance";


export const getAllUsers = async (params = {}) => {
  const response = await axiosInstance.get("/users/page", { params });
  return response;
};

export const getUserById = async (userId) => {
  const response = await axiosInstance.get(`/users/${userId}`);
  return response;
};


export const createStaff = async (payload) => {
  const payloadReq = { ...payload };
  if (payloadReq.password) {
    payloadReq.password = btoa(payloadReq.password);
  }
  const response = await axiosInstance.post("/users/staff", payloadReq);
  return response;
};

export const activateUser = async (userId) => {
  const response = await axiosInstance.patch(`/users/${userId}/activate`);
  return response;
};

export const deactivateUser = async (userId) => {
  const response = await axiosInstance.patch(`/users/${userId}/deactivate`);
  return response;
};

export default getAllUsers;