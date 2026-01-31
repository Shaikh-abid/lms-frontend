import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Course {
  _id: string;
  instructor: {
    name: string;
    _id: string;
    avatar: string;
  },
  courseTitle: string;
  subtitle: string;
  description: string;
  instructorId: string;
  thumbnail: string;
  price: number;
  originalPrice?: number;
  rating: number;
  studentsEnrolled: string[];
  isPublished: boolean;
  courseFor: string;
  courseOverview: string;
  coursePrerequisites: string;
  courseObjectives?: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  language: string;
  isBestseller?: boolean;
  isNew?: boolean;
  courseContent?: CourseSection[];
}

export interface CourseSection {
  _id: string;
  sectionTitle: string;
  lectures: Lecture[];
}

export interface Lecture {
  _id: string;
  title: string;
  videoDescription?: string;
  notes?: string;
  publicId?: string;
  duration?: string;
  videoUrl: string;
  freePreview: boolean;
}

interface CartState {
  items: Course[];
  addToCart: (course: Course) => void;
  removeFromCart: (courseId: string) => void;
  clearCart: () => void;
  isInCart: (courseId: string) => boolean;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (course) =>
        set((state) => {
          if (state.items.find((item) => item._id === course._id)) {
            return state;
          }
          return { items: [...state.items, course] };
        }),
      removeFromCart: (courseId) =>
        set((state) => ({
          items: state.items.filter((item) => item._id !== courseId),
        })),
      clearCart: () => set({ items: [] }),
      isInCart: (courseId) => get().items.some((item) => item._id === courseId),
      getTotal: () => get().items.reduce((total, item) => total + item.price, 0),
    }),
    {
      name: 'cart-storage',
    }
  )
);
