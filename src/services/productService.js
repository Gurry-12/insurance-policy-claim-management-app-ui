import axiosInstance from "../api/axiosInstance";
import { safeExtractArray, safeExtractPaginated } from "../utils/formatters";

export const getAllProducts = async () => {
  const response = await axiosInstance.get("/products/active");
  console.log(response);
  return safeExtractArray(response);
};

export const getAllProductsPaginated = async (params = {}) => {
  const response = await axiosInstance.get("/products/page", { params });
  return safeExtractPaginated(response);
};

export const getProductById = async (productId) => {
  const response = await axiosInstance.get(`/products/${productId}`);
  return response.data?.data;
};

export const createProduct = async (payload) => {
  const response = await axiosInstance.post('/products', payload);
  return response.data;
};

export const updateProduct = async (productId, payload) => {
  const response = await axiosInstance.put(`/products/${productId}`, payload);
  return response.data;
};

export const activateProduct = async (productId) => {
  const response = await axiosInstance.patch(`/products/${productId}/activate`);
  return response.data;
};

export const deactivateProduct = async (productId) => {
  const response = await axiosInstance.patch(`/products/${productId}/deactivate`);
  return response.data;

};

export const getActiveProducts = async () => {
  const { data } = await axiosInstance.get(
    "/products/active"
  );

  return data;
};