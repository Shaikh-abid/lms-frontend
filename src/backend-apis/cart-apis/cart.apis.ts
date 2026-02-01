import axiosInstance from "../../lib/axiosInstance";

const BASE_URL = "https://lms-backend-lgwf.onrender.com/api/cart"; // Adjust to your route prefix

export const addToCartApi = async (courseId: string) => {
  const response = await axiosInstance.post(`${BASE_URL}/add`, { courseId });
  return response.data;
};

export const removeFromCartApi = async (courseId: string) => {
  const response = await axiosInstance.delete(`${BASE_URL}/remove/${courseId}`);
  return response.data;
};

export const getCartItemsApi = async () => {
  const response = await axiosInstance.get(`${BASE_URL}/get`);
  return response.data;
};
