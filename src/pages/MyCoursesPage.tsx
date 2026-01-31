import MainLayout from '@/components/layout/MainLayout';
import { useCourseStore } from '@/store/courseStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Play, Clock, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyCoursesPage = () => {
  const { purchasedCourses, courseProgress } = useCourseStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center space-y-6">
            <h1 className="text-2xl font-bold">Please sign in</h1>
            <p className="text-muted-foreground">
              You need to sign in to view your purchased courses.
            </p>
            <Button variant="gradient" onClick={() => navigate('/signin')}>
              Sign In
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (purchasedCourses.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="h-24 w-24 mx-auto rounded-full bg-muted flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold">No courses yet</h1>
            <p className="text-muted-foreground">
              You haven't purchased any courses yet. Start your learning journey today!
            </p>
            <Button variant="gradient" onClick={() => navigate('/courses')}>
              Browse Courses
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Courses</h1>
          <p className="text-muted-foreground">
            Continue learning from where you left off
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {purchasedCourses.map((course) => {
            const progress = courseProgress[course._id]?.progress || 0;
            const isComplete = progress === 100;

            return (
              <div
                key={course._id}
                className="bg-card rounded-xl border border-border overflow-hidden hover-lift cursor-pointer group"
                onClick={() => navigate(`/course/${course._id}/learn`)}
              >
                <div className="relative aspect-video">
                  <img
                    src={course.thumbnail}
                    alt={course.
                      courseTitle}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="h-14 w-14 rounded-full gradient-primary flex items-center justify-center shadow-glow">
                      <Play className="h-6 w-6 text-primary-foreground ml-1" />
                    </div>
                  </div>
                  {isComplete && (
                    <div className="absolute top-3 right-3">
                      <div className="bg-success text-success-foreground px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Trophy className="h-3 w-3" />
                        Completed
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-4">
                  <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                    {course.
                      courseTitle}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <Button variant="gradient" className="w-full" size="sm">
                    {progress === 0 ? 'Start Course' : 'Continue Learning'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
};

export default MyCoursesPage;
