import axiosInstance from "../api/axiosInstance";
import { safeExtractArray, safeExtractPaginated } from "../utils/formatters";

export const getMyPolicies = async () => {
  const { data } = await axiosInstance.get("/policies/my-policies");
  return data;
};

export const getAllPolicies = async (params = {}) => {
  const response = await axiosInstance.get("/policies", { params });
  console.log(response);
  return safeExtractPaginated(response);
};

export const getPolicyById = async (policyId) => {
  const response = await axiosInstance.get(`/policies/${policyId}`);
  return response.data?.data;
};

export const getPoliciesByCustomerId = async (customerId) => {
  const response = await axiosInstance.get(`/policies/customer/${customerId}`);
  return safeExtractArray(response);
};

export const issuePolicy = async (payload) => {
  const response = await axiosInstance.post("/policies/issue", payload);
  return response.data;
};

export const cancelPolicy = async (policyId) => {
  const response = await axiosInstance.patch(`/policies/${policyId}/cancel`);
  return response.data;
};

export const purchasePolicy = async (payload) => {
  const { data } = await axiosInstance.post("/policies/purchase", payload);

  return data;
};
