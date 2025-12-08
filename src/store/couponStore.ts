import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Coupon {
  id: string;
  code: string;
  courseId: string;
  courseName: string;
  discountPercent: number;
  validFrom: string;
  validUntil: string;
  maxUses: number;
  currentUses: number;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}

interface CouponState {
  coupons: Coupon[];
  addCoupon: (coupon: Omit<Coupon, 'id' | 'currentUses' | 'createdAt'>) => void;
  removeCoupon: (couponId: string) => void;
  toggleCouponStatus: (couponId: string) => void;
  useCoupon: (couponCode: string, courseId: string) => number | null;
  getActiveCoupons: () => Coupon[];
  getCouponsByCourse: (courseId: string) => Coupon[];
  validateCoupon: (code: string, courseId: string) => Coupon | null;
}

export const useCouponStore = create<CouponState>()(
  persist(
    (set, get) => ({
      coupons: [
        {
          id: '1',
          code: 'WEBDEV50',
          courseId: '1',
          courseName: 'Complete Web Development Bootcamp',
          discountPercent: 50,
          validFrom: '2024-01-01',
          validUntil: '2024-12-31',
          maxUses: 100,
          currentUses: 23,
          isActive: true,
          createdBy: 'instructor-1',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          code: 'REACT30',
          courseId: '2',
          courseName: 'React - The Complete Guide',
          discountPercent: 30,
          validFrom: '2024-01-01',
          validUntil: '2024-06-30',
          maxUses: 50,
          currentUses: 12,
          isActive: true,
          createdBy: 'instructor-1',
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          code: 'PYTHON25',
          courseId: '3',
          courseName: 'Python for Data Science',
          discountPercent: 25,
          validFrom: '2024-02-01',
          validUntil: '2024-08-31',
          maxUses: 75,
          currentUses: 8,
          isActive: true,
          createdBy: 'instructor-2',
          createdAt: new Date().toISOString(),
        },
      ],
      addCoupon: (couponData) =>
        set((state) => ({
          coupons: [
            ...state.coupons,
            {
              ...couponData,
              id: Date.now().toString(),
              currentUses: 0,
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      removeCoupon: (couponId) =>
        set((state) => ({
          coupons: state.coupons.filter((c) => c.id !== couponId),
        })),
      toggleCouponStatus: (couponId) =>
        set((state) => ({
          coupons: state.coupons.map((c) =>
            c.id === couponId ? { ...c, isActive: !c.isActive } : c
          ),
        })),
      useCoupon: (couponCode, courseId) => {
        const coupon = get().validateCoupon(couponCode, courseId);
        if (!coupon) return null;
        
        set((state) => ({
          coupons: state.coupons.map((c) =>
            c.id === coupon.id ? { ...c, currentUses: c.currentUses + 1 } : c
          ),
        }));
        
        return coupon.discountPercent;
      },
      getActiveCoupons: () =>
        get().coupons.filter(
          (c) =>
            c.isActive &&
            new Date(c.validUntil) >= new Date() &&
            c.currentUses < c.maxUses
        ),
      getCouponsByCourse: (courseId) =>
        get().coupons.filter((c) => c.courseId === courseId),
      validateCoupon: (code, courseId) => {
        const coupon = get().coupons.find(
          (c) =>
            c.code.toLowerCase() === code.toLowerCase() &&
            c.courseId === courseId &&
            c.isActive &&
            new Date(c.validUntil) >= new Date() &&
            new Date(c.validFrom) <= new Date() &&
            c.currentUses < c.maxUses
        );
        return coupon || null;
      },
    }),
    {
      name: 'coupon-storage',
    }
  )
);
