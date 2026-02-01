import axiosInstance from "../../lib/axiosInstance";

const BASE_URL = "https://lms-backend-lgwf.onrender.com/api/";

export const createCourseApi = async (courseData) => {
  // Axios automatically detects FormData and sets the correct multipart headers
  const response = await axiosInstance.post(
    `${BASE_URL}courses/create`,
    courseData
  );
  return response.data;
};

export const addSectionsApi = async (data, courseId) => {
  const response = await axiosInstance.post(
    `${BASE_URL}courses/${courseId}/sections`,
    data
  );
  return response.data;
};

export const addLecturesApi = async (formData, courseId, sectionId) => {
  const response = await axiosInstance.post(
    `${BASE_URL}courses/${courseId}/sections/${sectionId}/lectures`,
    formData
  );
  return response.data;
};

export const getAllInstructorCoursesApi = async () => {
  const response = await axiosInstance.get(
    `${BASE_URL}courses/instructor-courses`
  );
  return response.data;
};

export const getInstructorAnalyticsApi = async () => {
  const response = await axiosInstance.get(
    `${BASE_URL}courses/instructor-analytics`
  );
  return response.data;
};

export const getCourseByIdApi = async (courseId) => {
  const response = await axiosInstance.get(`${BASE_URL}courses/${courseId}`);
  return response.data;
};

export const updateCourseApi = async (courseData, courseId) => {
  const response = await axiosInstance.put(
    `${BASE_URL}courses/${courseId}`,
    courseData
  );
  return response.data;
};

export const updateCourseLectureApi = async (
  formData,
  courseId,
  sectionId,
  lectureId
) => {
  const response = await axiosInstance.put(
    `${BASE_URL}courses/${courseId}/sections/${sectionId}/lectures/${lectureId}`,
    formData
  );
  return response.data;
};
