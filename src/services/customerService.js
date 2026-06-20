import axiosInstance from "../api/axiosInstance";

export const getProfile = async () => {
  const { data } = await axiosInstance.get("/customer/profile");
  return data;
};

export const createProfile = async (payload) => {
  const { data } = await axiosInstance.post(
    "/customer/profile",
    payload
  );
  return data;
};

export const updateProfile = async (payload) => {
  const { data } = await axiosInstance.put(
    "/customer/profile",
    payload
  );
  return data;
};