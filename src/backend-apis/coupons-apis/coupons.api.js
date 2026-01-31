import axiosInstance from "../../lib/axiosInstance";

const BASE_URL = "http://localhost:5000/api/";

// 1. Create Coupon
export const createCouponApi = async (couponData) => {
  const response = await axiosInstance.post(`${BASE_URL}coupons`, couponData);
  return response.data;
};

// 2. Get All Coupons for Instructor
export const getInstructorCouponsApi = async () => {
  const response = await axiosInstance.get(`${BASE_URL}coupons`);
  return response.data;
};

// 3. Toggle Status (Active/Inactive)
export const updateCouponStatusApi = async (id, isActive) => {
  const response = await axiosInstance.put(`${BASE_URL}coupons/${id}/status`, {
    isActive,
  });
  return response.data;
};

// 4. Delete Coupon
export const deleteCouponApi = async (id) => {
  const response = await axiosInstance.delete(`${BASE_URL}coupons/${id}`);
  return response.data;
};

export const getAvailableCouponsApi = async () => {
  const response = await axiosInstance.get(
    `${BASE_URL}coupons/get-available-coupons`
  );
  return response.data;
};

export const applyCouponApi = async (code, courseId) => {
  const response = await axiosInstance.post(
    `${BASE_URL}coupons/check-coupon?code=${code}&courseId=${courseId}`
  );
  return response.data;
};
