import axiosInstance from "../api/axiosInstance";

import { safeExtractArray } from "../utils/formatters";

// export const getAllClaims = async () => {
//   const response = await axiosInstance.get("/claims");
//   return safeExtractArray(response);
// };

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

export const raiseClaim = async (formData) => {
  const { data } = await axiosInstance.post(
    "/claims/raise",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

export const getMyClaims = async () => {
  const { data } = await axiosInstance.get(
    "/claims/my-claims"
  );

  return data;
};

export const getClaimHistory = async (claimId) => {
  const { data } = await axiosInstance.get(
    `/claims/${claimId}/history`
  );

  return data;
};

export const uploadDocuments = async (
  claimId,
  files
) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  const { data } = await axiosInstance.post(
    `/document/upload/${claimId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

// TODO: Claim API service


export const getAllClaims = async (userData, pageNumber = 0,
  pageSize = 10,
  sortBy = "policyId",
  sortDirection = "asc") => {

  
  const { data } = await axiosInstance.get('/claims', userData,{

   params: {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
     },
  });

  return data;
   
};

export const reviewClaim = async (claimId) => {
  const {data} = await axiosInstance.patch(`/claims/${claimId}/review`);
  return data;
};

export const markUnderReview = async (claimId) => {
  const {data} = await axiosInstance.patch(`/claims/${claimId}/under-review`);
  return data;
};
