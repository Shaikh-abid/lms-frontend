import axiosInstance from "../../lib/axiosInstance";

const BASE_URL = "https://lms-backend-lgwf.onrender.com/api/";

export const getAllCoursesForInstructorApi = async (filters) => {
  // send all filter in the query
  const query = Object.entries(filters)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  const response = await axiosInstance.get(
    `${BASE_URL}instructor/instructor-courses?${query}`
  );
  return response.data;
};

export const getCourseByIdinstructorViewApi = async (id) => {
  const response = await axiosInstance.get(
    `${BASE_URL}instructor/instructor-course-details?_id=${id}`
  );
  return response.data;
};
