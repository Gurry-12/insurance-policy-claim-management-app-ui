// TODO: Premium payment API service

import axiosInstance from "../api/axiosInstance";
import { safeExtractArray } from "../utils/formatters";

export const getAllPayments = async () => {
  const response = await axiosInstance.get("payments/page");
  console.log(response)
  return safeExtractArray(response);
};
