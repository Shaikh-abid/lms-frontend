/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourseStore } from '@/store/courseStore';
import { useCertificateStore } from '@/store/certificateStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  CheckCircle,
  Circle,
  PlayCircle,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  FileText,
  Menu,
  X,
  Trophy,
  Sparkles,
  Award,
  Download,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Confetti from '@/components/effects/Confetti';
import StudentNotes from '@/components/notes/StudentNotes';
import CourseCertificate from '@/components/certificate/CourseCertificate';
import { getCourseByIdinstructorViewApi } from '@/backend-apis/instructure-apis/instructure.api';
import { getCourseByIdStudentViewApi } from '@/backend-apis/student-apis/student.api';

const CourseProgressPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const certificateRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();
  
  const { 
    isPurchased, 
    markLectureComplete, 
    setLastWatched, 
    getCourseProgress,
    loadCourse
  } = useCourseStore();
  
  const { generateCertificate, getCertificate, hasCertificate } = useCertificateStore();

  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Safely get progress from store
  const progress = getCourseProgress(id || '');

  const [currentLectureId, setCurrentLectureId] = useState('');
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [currentVideoTime, setCurrentVideoTime] = useState(0);

  // Fetching Logic
  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!id || !user) return;

      setIsLoading(true);
      try {
        let response;
        if (user?.role === "instructor") {
          response = await getCourseByIdinstructorViewApi(id);
        } else {
          response = await getCourseByIdStudentViewApi(id);
        }

        if (response?.success) {
           const courseData = response.data?.courseDetails || response.data || response;
           setCourse(courseData);
           loadCourse(courseData);
        } else {
           setCourse(null);
        }
      } catch (error) {
        console.error("Failed to fetch course details", error);
        setCourse(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id, user, loadCourse]);

  const currentLecture = course?.courseContent
    ?.flatMap((s: any) => s.lectures)
    .find((l: any) => l._id === currentLectureId);

  const certificate = user && course
    ? getCertificate(course._id, user.email)
    : undefined;

  const isCourseCertified = user && course
    ? hasCertificate(course._id, user.email)
    : false;

  // Initialize State
  useEffect(() => {
    if (course) {
        // Optional: Redirect if not purchased logic
        
        const firstLecture = course.courseContent?.[0]?.lectures?.[0];
        const lastWatched = progress?.lastWatchedLecture;

        if (!currentLectureId) {
            if (lastWatched) {
                setCurrentLectureId(lastWatched);
            } else if (firstLecture) {
                setCurrentLectureId(firstLecture._id);
            }
        }

        if (expandedSections.length === 0) {
            setExpandedSections(course.courseContent?.map((s: any) => s._id) || []);
        }
    }
  }, [course, isPurchased, navigate, progress?.lastWatchedLecture, user?.role, currentLectureId, expandedSections.length]);

  // Completion Check
  useEffect(() => {
    if (progress?.progress === 100 && !showCompletionModal && !isCourseCertified && !isLoading) {
      setShowConfetti(true);
      setShowCompletionModal(true);
      setTimeout(() => setShowConfetti(false), 5000);

      if (user && course) {
        generateCertificate(
          course._id,
          course.courseTitle,
          user.name,
          user.email,
          course.instructor.name
        );
      }
    }
  }, [progress?.progress, showCompletionModal, isCourseCertified, user, course, generateCertificate, isLoading]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentVideoTime(videoRef.current.currentTime);
    }
  };

  const handleLectureClick = (lectureId: string) => {
    setCurrentLectureId(lectureId);
    if(course) setLastWatched(course._id, lectureId);
  };

  const handleVideoEnd = () => {
    if (currentLectureId && course) {
      markLectureComplete(course._id, currentLectureId);
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const isLectureCompleted = (lectureId: string) => {
    return progress?.completedLectures?.includes(lectureId) || false;
  };

  const getNextLecture = () => {
    if(!course) return null;
    const allLectures = course.courseContent?.flatMap((s: any) => s.lectures) || [];
    const currentIndex = allLectures.findIndex((l: any) => l._id === currentLectureId);
    return allLectures[currentIndex + 1];
  };

  const getPrevLecture = () => {
    if(!course) return null;
    const allLectures = course.courseContent?.flatMap((s: any) => s.lectures) || [];
    const currentIndex = allLectures.findIndex((l: any) => l._id === currentLectureId);
    return allLectures[currentIndex - 1];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading course content...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <h1 className="text-2xl font-bold">Course not found</h1>
        <p className="text-muted-foreground">We couldn't find the course you are looking for.</p>
        <Button onClick={() => navigate('/my-courses')}>Go to My Courses</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {showConfetti && <Confetti />}

      {showCompletionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-card rounded-3xl p-8 max-w-md mx-4 text-center space-y-6 shadow-2xl animate-scale-in">
            <div className="h-24 w-24 mx-auto rounded-full gradient-primary flex items-center justify-center shadow-glow">
              <Trophy className="h-12 w-12 text-primary-foreground" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                <Sparkles className="h-6 w-6 text-accent" />
                Congratulations!
                <Sparkles className="h-6 w-6 text-accent" />
              </h2>
              <p className="text-muted-foreground">
                You've completed <span className="font-semibold text-foreground">{course.courseTitle}</span>!
              </p>
              <p className="text-sm text-muted-foreground">
                Your certificate is ready!
              </p>
            </div>
            <div className="space-y-3">
              <Button
                variant="gradient"
                className="w-full gap-2"
                onClick={() => {
                  setShowCompletionModal(false);
                  setShowCertificateModal(true);
                }}
              >
                <Award className="h-4 w-4" />
                View Certificate
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setShowCompletionModal(false)}>
                Continue Learning
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      <Dialog open={showCertificateModal} onOpenChange={setShowCertificateModal}>
        <DialogContent className="max-w-5xl p-8">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Your Certificate
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-6">
            {certificate && (
              <>
                <CourseCertificate ref={certificateRef} certificate={certificate} />
                <Button variant="gradient" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download Certificate
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Top Navigation */}
      <header className="h-16 border-b border-border bg-card flex items-center px-4 gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/my-courses')}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="font-semibold truncate">{course.courseTitle}</h1>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <Progress value={progress?.progress || 0} className="w-32 h-2" />
          <span className="text-sm text-muted-foreground">{Math.round(progress?.progress || 0)}% complete</span>
          {isCourseCertified && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setShowCertificateModal(true)}
            >
              <Award className="h-4 w-4 text-amber-500" />
              Certificate
            </Button>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Video Section */}
        <div className={cn("flex-1 flex flex-col overflow-hidden", isSidebarOpen && "hidden lg:flex")}>
          <div className="bg-foreground aspect-video w-full flex-shrink-0">
            {currentLecture ? (
              <video
                ref={videoRef}
                key={currentLecture._id}
                className="w-full h-full"
                controls
                autoPlay
                onEnded={handleVideoEnd}
                onTimeUpdate={handleTimeUpdate}
                src={currentLecture.videoUrl}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted">
                Select a lecture to start learning
              </div>
            )}
          </div>

          <div className="p-6 space-y-6 overflow-auto flex-1">
            {currentLecture && (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">{currentLecture.title}</h2>
                    {currentLecture.videoDescription && (
                      <p className="text-muted-foreground">{currentLecture.videoDescription}</p>
                    )}
                  </div>
                  {isLectureCompleted(currentLecture._id) && (
                    <Badge className="bg-success text-success-foreground gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Completed
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    disabled={!getPrevLecture()}
                    onClick={() => getPrevLecture() && handleLectureClick(getPrevLecture()._id)}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <Button
                    variant="gradient"
                    disabled={!getNextLecture()}
                    onClick={() => getNextLecture() && handleLectureClick(getNextLecture()._id)}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>

                {currentLecture.notes && (
                  <div className="bg-muted rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2 font-semibold">
                      <FileText className="h-4 w-4" />
                      Lecture Notes
                    </div>
                    <p className="text-sm text-muted-foreground">{currentLecture.notes}</p>
                  </div>
                )}

                {!isLectureCompleted(currentLecture._id) && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => markLectureComplete(course._id, currentLecture._id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Complete
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside
          className={cn(
            "w-full lg:w-96 border-l border-border bg-card overflow-auto",
            !isSidebarOpen && "hidden lg:block"
          )}
        >
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold">Course Content</h2>
            <p className="text-sm text-muted-foreground">
              {progress?.completedLectures?.length || 0} / {course.courseContent?.reduce((acc: number, s: any) => acc + s.lectures.length, 0)} completed
            </p>
          </div>

          <div className="divide-y divide-border">
            {course.courseContent?.map((section: any, sectionIndex: number) => (
              <div key={section._id}>
                <button
                  className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                  onClick={() => toggleSection(section._id)}
                >
                  <div className="text-left">
                    <div className="font-medium text-sm">
                      Section {sectionIndex + 1}: {section.sectionTitle}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {section.lectures.filter((l: any) => progress?.completedLectures?.includes(l._id)).length} / {section.lectures.length} completed
                    </div>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 text-muted-foreground transition-transform",
                      expandedSections.includes(section._id) && "rotate-180"
                    )}
                  />
                </button>

                {expandedSections.includes(section._id) && (
                  <div className="bg-muted/30">
                    {section.lectures.map((lecture: any) => (
                      <button
                        key={lecture._id}
                        className={cn(
                          "w-full p-4 pl-6 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left",
                          currentLectureId === lecture._id && "bg-primary/10 border-l-2 border-primary"
                        )}
                        onClick={() => {
                          handleLectureClick(lecture._id);
                          if (window.innerWidth < 1024) {
                            setIsSidebarOpen(false);
                          }
                        }}
                      >
                        {isLectureCompleted(lecture._id) ? (
                          <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                        ) : currentLectureId === lecture._id ? (
                          <PlayCircle className="h-5 w-5 text-primary flex-shrink-0" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm truncate">{lecture.title}</div>
                          <div className="text-xs text-muted-foreground">{lecture.duration}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CourseProgressPage;