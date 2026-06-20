import axiosInstance from "../api/axiosInstance";

export const getMyPolicies = async () => {
  const { data } = await axiosInstance.get(
    "/policies/my-policies"
  );

  return data;
};