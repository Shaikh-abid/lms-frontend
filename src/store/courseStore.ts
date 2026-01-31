import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Course } from "./cartStore";
import axiosInstance from "../lib/axiosInstance";

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
  // NEW: Action to sync API data to store
  loadCourse: (course: Course) => void;
  markLectureComplete: (courseId: string, lectureId: string) => void;
  setLastWatched: (courseId: string, lectureId: string) => void;
  getCourseProgress: (courseId: string) => CourseProgress | undefined;
  isPurchased: (courseId: string) => boolean;
  isCompleted: (courseId: string) => boolean;
}

export const useCourseStore = create<CourseState>()(
  persist(
    (set, get) => ({
      purchasedCourses: [],
      courseProgress: {},

      // 1. NEW ACTION: Safely loads a course into the store if it doesn't exist
      loadCourse: (course) =>
        set((state) => {
          const isExisting = state.purchasedCourses.some(
            (c) => c._id === course._id
          );
          const hasProgress = state.courseProgress[course._id];

          // If it already exists and has progress tracking, do nothing
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
                  completedLectures: [],
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
                !state.purchasedCourses.find((p) => p._id === course._id)
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
        // 1. Optimistic Update (Update UI immediately before API finishes)
        set((state) => {
          const progress = state.courseProgress[courseId];
          if (!progress) return state;

          // If already marked, do nothing
          if (progress.completedLectures.includes(lectureId)) return state;

          const completedLectures = [...progress.completedLectures, lectureId];

          const course = state.purchasedCourses.find((c) => c._id === courseId);
          const totalLectures =
            course?.courseContent?.reduce(
              (acc, section) => acc + (section.lectures?.length || 0),
              0
            ) || 1;

          const newProgress = (completedLectures.length / totalLectures) * 100;

          return {
            courseProgress: {
              ...state.courseProgress,
              [courseId]: {
                ...progress,
                completedLectures,
                progress: newProgress,
              },
            },
            // Also update the purchasedCourses array for consistency
            purchasedCourses: state.purchasedCourses.map((c) =>
              c._id === courseId
                ? { ...c, completedLectures, progress: newProgress }
                : c
            ),
          };
        });

        // 2. Call the Backend API to save it permanently
        try {
          // Replace with your actual API URL or helper function
          await axiosInstance.post(
            "http://localhost:5000/api/student/course/progress/mark-complete",
            {
              courseId,
              lectureId,
            }
          );
        } catch (error) {
          console.error("Failed to save progress to server", error);
          // Optional: You could revert the state here if the API fails
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
    }
  )
);
