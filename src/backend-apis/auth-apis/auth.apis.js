import axiosInstance from "../../lib/axiosInstance";

const BASE_URL = "https://lms-backend-lgwf.onrender.com/";

export const loginApi = (data) => {
  return axiosInstance.post(`${BASE_URL}api/auth/login`, data);
};

export const registerApi = (data) => {
  return axiosInstance.post(`${BASE_URL}api/auth/register`, data);
};

export const logoutApi = () => {
  return axiosInstance.post(`${BASE_URL}api/auth/logout`);
};

export const getCurrentUserApi = () => {
  return axiosInstance.get(`${BASE_URL}api/auth/check`);
};

export const updateUserProfileApi = (data) => {
  return axiosInstance.patch(`${BASE_URL}api/auth/update-profile`, data);
};

export const changePasswordApi = (data) => {
  return axiosInstance.patch(`${BASE_URL}api/auth/update-password`, data);
};
