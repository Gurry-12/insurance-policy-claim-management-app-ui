import axiosInstance from "../api/axiosInstance";

export const getActivePlans = async () => {
  const { data } = await axiosInstance.get(
    "/plans/active"
  );

  return data;
};

export const getPlansByProduct = async (productId) => {
  const { data } = await axiosInstance.get(
    `/plans/${productId}/active`
  );

  return data;
};