import axiosInstance from "../api/axiosInstance";
import { safeExtractArray, safeExtractPaginated } from "../utils/formatters";

export const getAllPlansPainated = async (params = {}) => {
  const response = await axiosInstance.get("/plans/page", { params });
  console.log(response);
  return safeExtractPaginated(response);
};

export const getPlanById = async (planId) => {
  const response = await axiosInstance.get(`/plans/${planId}`);
  return response.data?.data;
};

export const getAllPlans = async () => {
  const response = await axiosInstance.get("/plans/active");
  console.log(response);
  return safeExtractArray(response);
};

export const createPlan = async (payload) => {
  const response = await axiosInstance.post('/plans', payload);
  return safeExtractArray(response);
};

export const updatePlan = async (planId, payload) => {
  const response = await axiosInstance.put(`/plans/${planId}`, payload);
  return safeExtractArray(response);
};

export const activatePlan = async (planId) => {
  const response = await axiosInstance.patch(`/plans/${planId}/activate`);
  return safeExtractArray(response);
};

export const deactivatePlan = async (planId) => {
  const response = await axiosInstance.patch(`/plans/${planId}/deactivate`);
  return safeExtractArray(response);
};

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