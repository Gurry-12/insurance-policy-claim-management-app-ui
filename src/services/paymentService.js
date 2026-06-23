
import axiosInstance from "../api/axiosInstance";
import { safeExtractArray, safeExtractPaginated } from "../utils/formatters";

export const getAllPayments = async (params = {}) => {
  const response = await axiosInstance.get("payments/page", { params });
  console.log(response)
  return safeExtractPaginated(response);
};

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

