import axiosInstance from "../../lib/axiosInstance";

const BASE_URL = "http://localhost:5000/api/";

export const getAllCourseStudentViewApi = async (filters) => {
  // send all filter in the query
  const query = Object.entries(filters)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  const response = await axiosInstance.get(
    `${BASE_URL}student/get-all-courses?${query}`
  );
  return response.data;
};

export const getCourseByIdStudentViewApi = async (id) => {
  const response = await axiosInstance.get(
    `${BASE_URL}student/get/details?id=${id}`
  );
  return response.data;
};

export const purchaseCourseCommonViewApi = async (data) => {
  const response = await axiosInstance.post(
    `${BASE_URL}order/make-payment`,
    data
  );
  return response.data;
};
