import axiosInstance from "../api/axiosInstance";
import { safeExtractArray, safeExtractPaginated } from "../utils/formatters";

export const getMyPolicies = async (params = {}) => {
  const { data } = await axiosInstance.get("/policies/my-policies", { params });
  return data;
};

export const getAllPoliciesPaginated = async (params = {}) => {
  const response = await axiosInstance.get("/policies", { params });
  return safeExtractPaginated(response);
};

// export const getAllPolicies = async () => {
//   const response = await axiosInstance.get('/policies');
//   return safeExtractArray(response);
// };

export const getPolicyById = async (policyId) => {
  const response = await axiosInstance.get(`/policies/${policyId}`);
  return response.data?.data;
};

export const getPoliciesByCustomerId = async (customerId) => {
  const response = await axiosInstance.get(`/policies/customer/${customerId}`);
  return safeExtractArray(response);
};

export const getClaimsByPolicy = async (policyId) => {
  const response = await axiosInstance.get(`/policies/${policyId}/claims`);
  return response.data?.data || response.data?.content || response.data || [];
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
// TODO: Policy API service

// export const getAllPolicies = async (userData) => {
//   const { data } = await axiosInstance.get('/policies', userData);
//   return data;
// };

// removed duplicated pagination API
