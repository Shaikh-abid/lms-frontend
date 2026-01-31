import { create } from "zustand";
import { toast } from "sonner";
// Import the APIs we created in the previous step
import {
  getAvailableCouponsApi,
  applyCouponApi,
} from "@/backend-apis/coupons-apis/coupons.api";

// Interface for the Applied Coupon (Result from Backend)
// {
//         "_id": "693e78abe1950dffb6e3d40d",
//         "code": "WEB50",
//         "courseId": {
//             "_id": "693e5de05614af2acafcb98b",
//             "courseTitle": "MERN Stack Development: Beginner to Advanced",
//             "thumbnail": "https://res.cloudinary.com/dyzx6kcju/image/upload/v1765694943/lms_courses/innthkvoy8mktpz8mih8.png",
//             "price": 699
//         },
//         "discountPercentage": 50,
//         "validFrom": "2025-12-14T00:00:00.000Z",
//         "validUntil": "2025-12-25T00:00:00.000Z",
//         "isActive": true,
//         "createdAt": "2025-12-14T08:43:23.713Z",
//         "updatedAt": "2025-12-14T08:43:23.713Z",
//         "__v": 0
//     },
export interface AppliedCoupon {
  code: string;
  discountPercentage: number;
  courseId: {
    _id: string;
    courseTitle: string;
    thumbnail: string;
    price: number;
  };
  createdAt: string;
  updatedAt: string;
  _id: string;
}

interface CouponState {
  // State
  availableCoupons: any[]; // List of public coupons for "Deals" page
  appliedCoupon: AppliedCoupon | null; // The coupon currently applied to Cart
  isLoading: boolean;

  // Actions
  fetchPublicCoupons: () => Promise<void>;
  applyCoupon: (code: string, courseId: string) => Promise<boolean>;
  removeAppliedCoupon: () => void;
}

export const useCouponStore = create<CouponState>((set, get) => ({
  // --- STATE ---
  availableCoupons: [],
  appliedCoupon: null,
  isLoading: false,

  // --- ACTIONS ---

  // 1. Fetch Public Coupons (For Explore/Deals Page)
  fetchPublicCoupons: async () => {
    set({ isLoading: true });
    try {
      const coupons = await getAvailableCouponsApi();
      set({ availableCoupons: coupons });
    } catch (error) {
      console.error("Failed to load public coupons", error);
    } finally {
      set({ isLoading: false });
    }
  },

  // 2. Apply Coupon (For Checkout Page)
  applyCoupon: async (code, courseId) => {
    // If empty code
    if (!code) {
      toast.error("Please enter a coupon code");
      return false;
    }

    set({ isLoading: true });
    try {
      // Call Backend to Validate
      const response = await applyCouponApi(code, courseId);

      // If successful, backend returns { message, discountPercentage, code, couponId }
      if (response) {
        set({
          appliedCoupon: {
            code: response.code,
            discountPercentage: response.discountPercentage,
            couponId: response.couponId,
          },
        });
        toast.success(
          `Coupon Applied! You saved ${response.discountPercentage}%`
        );
        return true;
      }
      return false;
    } catch (error: any) {
      // Backend handles validation (Expiry, Invalid Code, Max Limit)
      const errorMsg = error.response?.data?.message || "Invalid Coupon";
      toast.error(errorMsg);
      set({ appliedCoupon: null });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  // 3. Remove Coupon (User clicks "X" on checkout)
  removeAppliedCoupon: () => {
    set({ appliedCoupon: null });
    toast.info("Coupon removed");
  },
}));
