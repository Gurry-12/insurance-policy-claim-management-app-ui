
import axiosInstance from "../api/axiosInstance";
import { safeExtractPaginated } from "../utils/formatters";

export const getAllPaymentsPaginated = async (params = {}) => {
  const response = await axiosInstance.get("payments/page", { params });
  return safeExtractPaginated(response);
};


// export const getAllPayments = async () => {
//   const response = await axiosInstance.get("payments/page");
//   console.log(response)
//   return safeExtractArray(response);
// };


export const recordPayment = async (paymentData) => {
  const { data } = await axiosInstance.post(
    "/payments",
    paymentData
  );
  return data;
};

export const getMyPayments = async () => {
  const { data } = await axiosInstance.get(
    "/payments/my-payments"
  );
  return data;
};

export const getPaymentsByMyPolicy = async (policyId) => {
  const { data } = await axiosInstance.get(
    `/payments/my-policies/${policyId}`
  );
  return data;
};


export const getPaymentsByPolicyId = async (policyId) => {
  const response = await axiosInstance.get(`/payments/policy/${policyId}`);
  return response.data?.data || [];
};

export const getAllPayments = async (userData, pageNumber = 0,
  pageSize = 10,
  sortBy = "paymentId",
  sortDirection = "asc") => {

  
  const { data } = await axiosInstance.get('/payments/page', userData,{

   params: {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
     },


   });

  return data;
 };
