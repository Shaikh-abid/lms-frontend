import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Certificate {
  id: string;
  courseId: string;
  courseName: string;
  studentName: string;
  studentEmail: string;
  instructorName: string;
  completedAt: string;
  certificateNumber: string;
}

interface CertificateState {
  certificates: Certificate[];
  generateCertificate: (
    courseId: string,
    courseName: string,
    studentName: string,
    studentEmail: string,
    instructorName: string
  ) => Certificate;
  getCertificate: (courseId: string, studentEmail: string) => Certificate | undefined;
  hasCertificate: (courseId: string, studentEmail: string) => boolean;
}

const generateCertificateNumber = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'LMS-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const useCertificateStore = create<CertificateState>()(
  persist(
    (set, get) => ({
      certificates: [],
      generateCertificate: (courseId, courseName, studentName, studentEmail, instructorName) => {
        const existing = get().getCertificate(courseId, studentEmail);
        if (existing) return existing;

        const certificate: Certificate = {
          id: Date.now().toString(),
          courseId,
          courseName,
          studentName,
          studentEmail,
          instructorName,
          completedAt: new Date().toISOString(),
          certificateNumber: generateCertificateNumber(),
        };

        set((state) => ({
          certificates: [...state.certificates, certificate],
        }));

        return certificate;
      },
      getCertificate: (courseId, studentEmail) =>
        get().certificates.find(
          (c) => c.courseId === courseId && c.studentEmail === studentEmail
        ),
      hasCertificate: (courseId, studentEmail) =>
        get().certificates.some(
          (c) => c.courseId === courseId && c.studentEmail === studentEmail
        ),
    }),
    {
      name: 'certificate-storage',
    }
  )
);
