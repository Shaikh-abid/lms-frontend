import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Course } from "./cartStore";
import axiosInstance from "../lib/axiosInstance"; // Ensure this import is correct

const BASE_URL = "http://localhost:5000/";

export interface PurchasedCourse extends Course {
  purchasedAt: string;
  progress: number;
  completedLectures: string[];
}

interface CourseProgress {
  courseId: string;
  completedLectures: string[];
  lastWatchedLecture: string | null;
  progress: number;
}

interface CourseState {
  purchasedCourses: PurchasedCourse[];
  courseProgress: Record<string, CourseProgress>;
  purchaseCourses: (courses: Course[]) => void;
  loadCourse: (course: Course) => void;
  markLectureComplete: (courseId: string, lectureId: string) => Promise<void>; // Updated return type
  setLastWatched: (courseId: string, lectureId: string) => void;
  getCourseProgress: (courseId: string) => CourseProgress | undefined;
  isPurchased: (courseId: string) => boolean;
  isCompleted: (courseId: string) => boolean;

  syncPurchasedCourses: (courses: Course[]) => void;
  reset: () => void;
}

export const useCourseStore = create<CourseState>()(
  persist(
    (set, get) => ({
      purchasedCourses: [],
      courseProgress: {},

      // 1. NEW: Called on Login to set the user's courses
      syncPurchasedCourses: (courses) =>
        set((state) => {
          // Map backend courses to store format
          const mappedCourses = courses.map((course) => {
            // If we already have this course in local state, keep its progress
            const existing = state.purchasedCourses.find(
              (p) => p._id === course._id,
            );
            return {
              ...course,
              purchasedAt: existing
                ? existing.purchasedAt
                : new Date().toISOString(),
              progress: existing ? existing.progress : 0,
              completedLectures: existing ? existing.completedLectures : [],
            };
          });

          // Ensure progress objects exist
          const newCourseProgress = { ...state.courseProgress };
          mappedCourses.forEach((c) => {
            if (!newCourseProgress[c._id]) {
              newCourseProgress[c._id] = {
                courseId: c._id,
                completedLectures: [],
                lastWatchedLecture: null,
                progress: 0,
              };
            }
          });

          return {
            purchasedCourses: mappedCourses, // Overwrite with fresh list
            courseProgress: newCourseProgress,
          };
        }),

      // 2. NEW: Called on Logout to clear data
      reset: () => set({ purchasedCourses: [], courseProgress: {} }),

      loadCourse: (course) =>
        set((state) => {
          const isExisting = state.purchasedCourses.some(
            (c) => c._id === course._id,
          );
          const hasProgress = state.courseProgress[course._id];

          if (isExisting && hasProgress) return state;

          const newPurchasedCourses = isExisting
            ? state.purchasedCourses
            : [
                ...state.purchasedCourses,
                {
                  ...course,
                  purchasedAt: new Date().toISOString(),
                  progress: 0,
                  completedLectures: [],
                },
              ];

          const newCourseProgress = hasProgress
            ? state.courseProgress
            : {
                ...state.courseProgress,
                [course._id]: {
                  courseId: course._id,
                  completedLectures: [], // Initialize with empty or map from backend if available
                  lastWatchedLecture: null,
                  progress: 0,
                },
              };

          return {
            purchasedCourses: newPurchasedCourses,
            courseProgress: newCourseProgress,
          };
        }),

      purchaseCourses: (courses) =>
        set((state) => {
          const newPurchases = courses
            .filter(
              (course) =>
                !state.purchasedCourses.find((p) => p._id === course._id),
            )
            .map((course) => ({
              ...course,
              purchasedAt: new Date().toISOString(),
              progress: 0,
              completedLectures: [],
            }));

          const newProgress: Record<string, CourseProgress> = {};
          newPurchases.forEach((course) => {
            newProgress[course._id] = {
              courseId: course._id,
              completedLectures: [],
              lastWatchedLecture: null,
              progress: 0,
            };
          });

          return {
            purchasedCourses: [...state.purchasedCourses, ...newPurchases],
            courseProgress: { ...state.courseProgress, ...newProgress },
          };
        }),

      markLectureComplete: async (courseId, lectureId) => {
        // 1. Optimistic Update
        set((state) => {
          let progress = state.courseProgress[courseId];

          // Initialize if missing
          if (!progress) {
            progress = {
              courseId,
              completedLectures: [],
              lastWatchedLecture: null,
              progress: 0,
            };
          }

          if (progress.completedLectures.includes(lectureId)) return state;

          const completedLectures = [...progress.completedLectures, lectureId];

          const course = state.purchasedCourses.find((c) => c._id === courseId);
          // Fallback logic for total lectures
          const totalLectures =
            course?.courseContent?.reduce(
              (acc, section) => acc + (section.lectures?.length || 0),
              0,
            ) || 1;

          const newProgress = Math.min(
            (completedLectures.length / totalLectures) * 100,
            100,
          );

          return {
            courseProgress: {
              ...state.courseProgress,
              [courseId]: {
                ...progress,
                completedLectures,
                progress: newProgress,
              },
            },
            purchasedCourses: state.purchasedCourses.map((c) =>
              c._id === courseId
                ? { ...c, completedLectures, progress: newProgress }
                : c,
            ),
          };
        });

        // 2. Call Backend API
        try {
          // Ensure the endpoint matches your backend route exactly
          await axiosInstance.post(
            `${BASE_URL}api/student/course/progress/mark-complete`,
            {
              courseId,
              lectureId,
            },
          );
        } catch (error) {
          console.error("Failed to save progress to server", error);
          // Ideally, revert the optimistic update here if needed
        }
      },

      setLastWatched: (courseId, lectureId) =>
        set((state) => {
          if (!state.courseProgress[courseId]) return state;
          return {
            courseProgress: {
              ...state.courseProgress,
              [courseId]: {
                ...state.courseProgress[courseId],
                lastWatchedLecture: lectureId,
              },
            },
          };
        }),

      getCourseProgress: (courseId) => get().courseProgress[courseId],

      isPurchased: (courseId) =>
        get().purchasedCourses.some((c) => c._id === courseId),

      isCompleted: (courseId) => {
        const progress = get().courseProgress[courseId];
        return progress?.progress === 100;
      },
    }),
    {
      name: "course-storage",
    },
  ),
);
