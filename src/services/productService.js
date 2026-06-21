import axiosInstance from "../api/axiosInstance";

export const getActiveProducts = async () => {
  const { data } = await axiosInstance.get(
    "/products/active"
  );

  return data;
};