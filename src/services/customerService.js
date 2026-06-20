import axiosInstance from "../api/axiosInstance";

export const getProfile = async () => {
  const { data } = await axiosInstance.get(
    "/customers/profile"
  );

  return data;
};

export const createProfile = async (payload) => {
  const { data } = await axiosInstance.post(
    "/customers",
    payload
  );

  return data;
};

export const updateProfile = async (
  customerId,
  payload
) => {
  const { data } = await axiosInstance.put(
    `/customers/${customerId}`,
    payload
  );

  return data;
};