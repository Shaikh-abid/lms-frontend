import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockCourses } from '@/data/courses';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Confetti from '@/components/effects/Confetti';
import StudentNotes from '@/components/notes/StudentNotes';
import CourseCertificate from '@/components/certificate/CourseCertificate';

const CourseProgressPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const certificateRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();
  const { isPurchased, markLectureComplete, setLastWatched, getCourseProgress } = useCourseStore();
  const { generateCertificate, getCertificate, hasCertificate } = useCertificateStore();

  const course = mockCourses.find((c) => c.id === id);
  const progress = getCourseProgress(id || '');

  const [currentLectureId, setCurrentLectureId] = useState<string>('');
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [currentVideoTime, setCurrentVideoTime] = useState(0);

  // Find current lecture
  const currentLecture = course?.curriculum
    ?.flatMap((s) => s.lectures)
    .find((l) => l.id === currentLectureId);

  // Certificate data
  const certificate = user && course 
    ? getCertificate(course.id, user.email) 
    : undefined;

  const isCourseCertified = user && course 
    ? hasCertificate(course.id, user.email) 
    : false;

  // Initialize
  useEffect(() => {
    if (!course || !isPurchased(course.id)) {
      navigate(`/course/${id}`);
      return;
    }

    // Set initial lecture
    const firstLecture = course.curriculum?.[0]?.lectures?.[0];
    const lastWatched = progress?.lastWatchedLecture;
    
    if (lastWatched) {
      setCurrentLectureId(lastWatched);
    } else if (firstLecture) {
      setCurrentLectureId(firstLecture.id);
    }

    // Expand all sections by default
    setExpandedSections(course.curriculum?.map((s) => s.id) || []);
  }, [course, id, isPurchased, navigate, progress?.lastWatchedLecture]);

  // Check for course completion
  useEffect(() => {
    if (progress?.progress === 100 && !showCompletionModal && !isCourseCertified) {
      setShowConfetti(true);
      setShowCompletionModal(true);
      setTimeout(() => setShowConfetti(false), 5000);

      // Generate certificate
      if (user && course) {
        generateCertificate(
          course.id,
          course.title,
          user.name,
          user.email,
          course.instructor
        );
      }
    }
  }, [progress?.progress, showCompletionModal, isCourseCertified, user, course, generateCertificate]);

  // Update video time
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentVideoTime(videoRef.current.currentTime);
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Course not found</h1>
          <Button onClick={() => navigate('/my-courses')}>Go to My Courses</Button>
        </div>
      </div>
    );
  }

  const handleLectureClick = (lectureId: string) => {
    setCurrentLectureId(lectureId);
    setLastWatched(course.id, lectureId);
  };

  const handleVideoEnd = () => {
    if (currentLectureId) {
      markLectureComplete(course.id, currentLectureId);
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
    return progress?.completedLectures.includes(lectureId) || false;
  };

  const getNextLecture = () => {
    const allLectures = course.curriculum?.flatMap((s) => s.lectures) || [];
    const currentIndex = allLectures.findIndex((l) => l.id === currentLectureId);
    return allLectures[currentIndex + 1];
  };

  const getPrevLecture = () => {
    const allLectures = course.curriculum?.flatMap((s) => s.lectures) || [];
    const currentIndex = allLectures.findIndex((l) => l.id === currentLectureId);
    return allLectures[currentIndex - 1];
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Confetti Effect */}
      {showConfetti && <Confetti />}

      {/* Completion Modal */}
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
                You've completed <span className="font-semibold text-foreground">{course.title}</span>!
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
          <h1 className="font-semibold truncate">{course.title}</h1>
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
          {/* Video Player */}
          <div className="bg-foreground aspect-video w-full flex-shrink-0">
            {currentLecture ? (
              <video
                ref={videoRef}
                key={currentLecture.id}
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

          {/* Lecture Info & Notes */}
          <div className="p-6 space-y-6 overflow-auto flex-1">
            {currentLecture && (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">{currentLecture.title}</h2>
                    {currentLecture.description && (
                      <p className="text-muted-foreground">{currentLecture.description}</p>
                    )}
                  </div>
                  {isLectureCompleted(currentLecture.id) && (
                    <Badge className="bg-success text-success-foreground gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Completed
                    </Badge>
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    disabled={!getPrevLecture()}
                    onClick={() => getPrevLecture() && handleLectureClick(getPrevLecture()!.id)}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <Button
                    variant="gradient"
                    disabled={!getNextLecture()}
                    onClick={() => getNextLecture() && handleLectureClick(getNextLecture()!.id)}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>

                {/* Instructor Notes */}
                {currentLecture.notes && (
                  <div className="bg-muted rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2 font-semibold">
                      <FileText className="h-4 w-4" />
                      Lecture Notes
                    </div>
                    <p className="text-sm text-muted-foreground">{currentLecture.notes}</p>
                  </div>
                )}

                {/* Student Notes Section */}
                <StudentNotes 
                  courseId={course.id} 
                  lectureId={currentLecture.id}
                  currentVideoTime={currentVideoTime}
                />

                {/* Mark Complete Button */}
                {!isLectureCompleted(currentLecture.id) && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => markLectureComplete(course.id, currentLecture.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Complete
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Sidebar - Course Content */}
        <aside
          className={cn(
            "w-full lg:w-96 border-l border-border bg-card overflow-auto",
            !isSidebarOpen && "hidden lg:block"
          )}
        >
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold">Course Content</h2>
            <p className="text-sm text-muted-foreground">
              {progress?.completedLectures.length || 0} / {course.curriculum?.reduce((acc, s) => acc + s.lectures.length, 0)} completed
            </p>
          </div>

          <div className="divide-y divide-border">
            {course.curriculum?.map((section, sectionIndex) => (
              <div key={section.id}>
                <button
                  className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="text-left">
                    <div className="font-medium text-sm">
                      Section {sectionIndex + 1}: {section.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {section.lectures.filter((l) => isLectureCompleted(l.id)).length} / {section.lectures.length} completed
                    </div>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 text-muted-foreground transition-transform",
                      expandedSections.includes(section.id) && "rotate-180"
                    )}
                  />
                </button>

                {expandedSections.includes(section.id) && (
                  <div className="bg-muted/30">
                    {section.lectures.map((lecture) => (
                      <button
                        key={lecture.id}
                        className={cn(
                          "w-full p-4 pl-6 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left",
                          currentLectureId === lecture.id && "bg-primary/10 border-l-2 border-primary"
                        )}
                        onClick={() => {
                          handleLectureClick(lecture.id);
                          if (window.innerWidth < 1024) {
                            setIsSidebarOpen(false);
                          }
                        }}
                      >
                        {isLectureCompleted(lecture.id) ? (
                          <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                        ) : currentLectureId === lecture.id ? (
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
