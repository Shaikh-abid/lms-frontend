import { forwardRef } from 'react';
import { Certificate } from '@/store/certificateStore';
import { Award, Star, GraduationCap } from 'lucide-react';

interface CourseCertificateProps {
  certificate: Certificate;
}

const CourseCertificate = forwardRef<HTMLDivElement, CourseCertificateProps>(
  ({ certificate }, ref) => {
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };

    return (
      <div
        ref={ref}
        className="relative w-full max-w-4xl aspect-[1.414/1] bg-gradient-to-br from-amber-50 via-white to-amber-50 rounded-lg overflow-hidden shadow-2xl"
        style={{ minHeight: '600px' }}
      >
        {/* Decorative Border */}
        <div className="absolute inset-3 border-4 border-double border-amber-600/40 rounded-lg" />
        <div className="absolute inset-6 border border-amber-600/20 rounded-lg" />

        {/* Corner Decorations */}
        <div className="absolute top-8 left-8">
          <Star className="h-8 w-8 text-amber-500 fill-amber-400" />
        </div>
        <div className="absolute top-8 right-8">
          <Star className="h-8 w-8 text-amber-500 fill-amber-400" />
        </div>
        <div className="absolute bottom-8 left-8">
          <Star className="h-8 w-8 text-amber-500 fill-amber-400" />
        </div>
        <div className="absolute bottom-8 right-8">
          <Star className="h-8 w-8 text-amber-500 fill-amber-400" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-12 py-10 text-center">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
              <GraduationCap className="h-10 w-10 text-white" />
            </div>
          </div>

          <h3 className="text-amber-700 font-semibold text-lg tracking-wider uppercase mb-2">
            LMS System
          </h3>

          {/* Certificate Title */}
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-amber-800 mb-2">
            Certificate of Completion
          </h1>

          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mb-6" />

          {/* Recipient */}
          <p className="text-gray-600 text-lg mb-2">This is to certify that</p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mb-4 italic">
            {certificate.studentName}
          </h2>

          {/* Course */}
          <p className="text-gray-600 text-lg mb-2">has successfully completed the course</p>
          <h3 className="text-2xl font-semibold text-amber-700 mb-6 max-w-lg">
            {certificate.courseName}
          </h3>

          {/* Award Icon */}
          <div className="my-4">
            <Award className="h-16 w-16 text-amber-500 mx-auto" />
          </div>

          {/* Date & Certificate Number */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-4 text-gray-600">
            <div>
              <p className="text-sm uppercase tracking-wider text-gray-500">Date of Completion</p>
              <p className="font-semibold">{formatDate(certificate.completedAt)}</p>
            </div>
            <div className="hidden sm:block w-px h-10 bg-gray-300" />
            <div>
              <p className="text-sm uppercase tracking-wider text-gray-500">Certificate ID</p>
              <p className="font-mono font-semibold">{certificate.certificateNumber}</p>
            </div>
          </div>

          {/* Instructor Signature */}
          <div className="mt-8 pt-6 border-t border-amber-200 w-64">
            <div className="font-script text-2xl italic text-gray-700 mb-1">
              {certificate.instructorName}
            </div>
            <p className="text-sm text-gray-500 uppercase tracking-wider">Course Instructor</p>
          </div>
        </div>

        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <GraduationCap className="h-96 w-96 text-amber-900" />
        </div>
      </div>
    );
  }
);

CourseCertificate.displayName = 'CourseCertificate';

export default CourseCertificate;
