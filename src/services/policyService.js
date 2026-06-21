import axiosInstance from "../api/axiosInstance";

export const getMyPolicies = async () => {
  const { data } = await axiosInstance.get(
    "/policies/my-policies"
  );

  return data;
};

export const purchasePolicy = async (payload) => {
  const { data } = await axiosInstance.post(
    "/policies/purchase",
    payload
  );

  return data;
};