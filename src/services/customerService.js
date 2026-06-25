import axiosInstance from "../api/axiosInstance";
import { safeExtractPaginated } from "../utils/formatters";

export const getProfile = async () => {
  const { data } = await axiosInstance.get(
    "/customers/profile"
  );

  return data;
};

export const createProfile = async (payload) => {
  const { data } = await axiosInstance.post(
    "/customers",
    payload
  );

  return data;
};

export const updateProfile = async (
  customerId,
  payload
) => {
  const { data } = await axiosInstance.put(
    `/customers/${customerId}`,
    payload
  );

  return data;
};


export const getAllCustomersPaginated = async (params = {}) => {
  const response = await axiosInstance.get('/customers/page', { params });
  console.log(response)
  return safeExtractPaginated(response);
}

export const getAllCustomers = async () => {
  const {data } = await axiosInstance.get("/customers");
  return data.data;
};

export const getCustomerById = async (customerId) => {
  const response = await axiosInstance.get(`/customers/${customerId}`);
  return response.data?.data;
}
// TODO: Customer profile API service


// export const getAllCustomers = async (userData) => {
//   const { data } = await axiosInstance.get('/customers', userData);
//   return data.data;
// };
