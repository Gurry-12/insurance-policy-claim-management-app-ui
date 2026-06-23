// TODO: Claim status history API service

import axiosInstance from "../api/axiosInstance";

export const getClaimHistory = async () => {
  const response = await axiosInstance.get("/claims/{claimId}/history");
  return response.data;
};
