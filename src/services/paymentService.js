import axiosInstance from "../api/axiosInstance";

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