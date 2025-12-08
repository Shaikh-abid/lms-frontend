import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface StudentNote {
  id: string;
  courseId: string;
  lectureId: string;
  content: string;
  timestamp: number;
  createdAt: string;
  updatedAt: string;
}

interface NotesState {
  notes: StudentNote[];
  addNote: (courseId: string, lectureId: string, content: string, timestamp: number) => void;
  updateNote: (noteId: string, content: string) => void;
  deleteNote: (noteId: string) => void;
  getNotesByLecture: (courseId: string, lectureId: string) => StudentNote[];
  getNotesByCourse: (courseId: string) => StudentNote[];
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: [],
      addNote: (courseId, lectureId, content, timestamp) =>
        set((state) => ({
          notes: [
            ...state.notes,
            {
              id: Date.now().toString(),
              courseId,
              lectureId,
              content,
              timestamp,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        })),
      updateNote: (noteId, content) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === noteId
              ? { ...note, content, updatedAt: new Date().toISOString() }
              : note
          ),
        })),
      deleteNote: (noteId) =>
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== noteId),
        })),
      getNotesByLecture: (courseId, lectureId) =>
        get().notes.filter(
          (note) => note.courseId === courseId && note.lectureId === lectureId
        ),
      getNotesByCourse: (courseId) =>
        get().notes.filter((note) => note.courseId === courseId),
    }),
    {
      name: 'student-notes-storage',
    }
  )
);
