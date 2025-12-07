import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorId: string;
  thumbnail: string;
  price: number;
  originalPrice?: number;
  rating: number;
  studentsCount: number;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  language: string;
  isBestseller?: boolean;
  isNew?: boolean;
  curriculum?: CourseSection[];
}

export interface CourseSection {
  id: string;
  title: string;
  lectures: Lecture[];
}

export interface Lecture {
  id: string;
  title: string;
  description?: string;
  duration: string;
  videoUrl: string;
  isFreePreview: boolean;
  notes?: string;
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
          if (state.items.find((item) => item.id === course.id)) {
            return state;
          }
          return { items: [...state.items, course] };
        }),
      removeFromCart: (courseId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== courseId),
        })),
      clearCart: () => set({ items: [] }),
      isInCart: (courseId) => get().items.some((item) => item.id === courseId),
      getTotal: () => get().items.reduce((total, item) => total + item.price, 0),
    }),
    {
      name: 'cart-storage',
    }
  )
);
