import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Course, CourseSection } from './cartStore';

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
      purchaseCourses: (courses) =>
        set((state) => {
          const newPurchases = courses
            .filter((course) => !state.purchasedCourses.find((p) => p.id === course.id))
            .map((course) => ({
              ...course,
              purchasedAt: new Date().toISOString(),
              progress: 0,
              completedLectures: [],
            }));
          
          const newProgress: Record<string, CourseProgress> = {};
          newPurchases.forEach((course) => {
            newProgress[course.id] = {
              courseId: course.id,
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
      markLectureComplete: (courseId, lectureId) =>
        set((state) => {
          const progress = state.courseProgress[courseId];
          if (!progress) return state;

          const completedLectures = progress.completedLectures.includes(lectureId)
            ? progress.completedLectures
            : [...progress.completedLectures, lectureId];

          const course = state.purchasedCourses.find((c) => c.id === courseId);
          const totalLectures = course?.curriculum?.reduce(
            (acc, section) => acc + section.lectures.length,
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
            purchasedCourses: state.purchasedCourses.map((c) =>
              c.id === courseId
                ? { ...c, completedLectures, progress: newProgress }
                : c
            ),
          };
        }),
      setLastWatched: (courseId, lectureId) =>
        set((state) => ({
          courseProgress: {
            ...state.courseProgress,
            [courseId]: {
              ...state.courseProgress[courseId],
              lastWatchedLecture: lectureId,
            },
          },
        })),
      getCourseProgress: (courseId) => get().courseProgress[courseId],
      isPurchased: (courseId) =>
        get().purchasedCourses.some((c) => c.id === courseId),
      isCompleted: (courseId) => {
        const progress = get().courseProgress[courseId];
        return progress?.progress === 100;
      },
    }),
    {
      name: 'course-storage',
    }
  )
);
