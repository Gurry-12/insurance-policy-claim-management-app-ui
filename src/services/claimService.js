import axiosInstance from "../api/axiosInstance";
import { safeExtractArray } from "../utils/formatters";

export const getAllClaims = async () => {
  const response = await axiosInstance.get("/claims");
  return safeExtractArray(response);
};

export const getClaimById = async (claimId) => {
  const response = await axiosInstance.get(`/claims/${claimId}`);
  return response.data.data;
};

export const approveClaim = async (claimId, payload) => {
  const response = await axiosInstance.put(`/claims/${claimId}/approve`, payload);
  return safeExtractArray(response);
};

export const rejectClaim = async (claimId, reason) => {
  const response = await axiosInstance.put(`/claims/${claimId}/reject`, { reason });
  return safeExtractArray(response);
};
