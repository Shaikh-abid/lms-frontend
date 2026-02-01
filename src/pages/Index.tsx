import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { mockCourses } from '@/data/courses';
import CourseCard from '@/components/courses/CourseCard';
import {
  GraduationCap,
  PlayCircle,
  Award,
  Users,
  BookOpen,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Target,
  Zap,
  Loader2
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { getAllCoursesForInstructorApi } from '@/backend-apis/instructure-apis/instructure.api';
import { getAllCourseStudentViewApi } from '@/backend-apis/student-apis/student.api';

const stats = [
  { icon: Users, value: '500K+', label: 'Active Students' },
  { icon: BookOpen, value: '1000+', label: 'Quality Courses' },
  { icon: Award, value: '150+', label: 'Expert Instructors' },
  { icon: PlayCircle, value: '10M+', label: 'Video Lessons' },
];

const features = [
  {
    icon: Sparkles,
    title: 'Expert-Led Courses',
    description: 'Learn from industry professionals with years of real-world experience.',
  },
  {
    icon: Target,
    title: 'Hands-On Projects',
    description: 'Build real projects that you can add to your portfolio and resume.',
  },
  {
    icon: Zap,
    title: 'Lifetime Access',
    description: 'Once enrolled, access your courses forever with free updates.',
  },
  {
    icon: Award,
    title: 'Certificates',
    description: 'Earn recognized certificates to showcase your new skills.',
  },
];


const Index = () => {
  const navigate = useNavigate();
  const [coursesToShow, setCoursesToShow] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let response;
        const commonParams = {
          searchQuery: "",
          selectedCategories: [],
          selectedLevels: [],
          selectedLanguages: [],
          sortBy: "",
        };

        // If user is instructor, show instructor-specific data
        if (user?.role === "instructor") {
          response = await getAllCoursesForInstructorApi(commonParams);
          if (response?.success) {
            setCoursesToShow(response.courses || []);
          }
        }
        // Default case: Show Student View API for both Students and Guests (No User)
        else {
          response = await getAllCourseStudentViewApi(commonParams);
          if (response?.success) {
            // Note: Keeping response.data as per your original snippet logic
            setCoursesToShow(response.data || []);
          }
        }
      } catch (error) {
        console.error("Failed to fetch courses", error);
        setCoursesToShow([]);
      } finally {
        setLoading(false);
      }
    };

    // We no longer wrap this in "if (user)". 
    // It will trigger on initial load for guests.
    const timer = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(timer);
  }, [user]); // Re-run if login status changes



  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 gradient-hero opacity-5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" />

        <div className="container mx-auto px-4 py-20 lg:py-32 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium animate-fade-in">
              <Sparkles className="h-4 w-4" />
              <span>Trusted by 500,000+ learners worldwide</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-slide-up">
              Transform Your Career with{' '}
              <span className="gradient-text">World-Class</span> Online Courses
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up delay-100">
              Unlock your potential with our comprehensive library of courses taught by industry experts. Start learning today and build the skills employers want.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up delay-200">
              <Button
                variant="hero"
                size="xl"
                onClick={() => navigate('/courses')}
                className="gap-2"
              >
                Explore Courses
                <ArrowRight className="h-5 w-5" />
              </Button>
              {
                !user && (
                  <Button
                    variant="hero-outline"
                    size="xl"
                    onClick={() => navigate('/signup')}
                  >
                    Start Free Trial
                  </Button>
                )
              }
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-8 animate-fade-in delay-300">
              {['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple'].map((company) => (
                <span key={company} className="text-muted-foreground/50 font-semibold text-lg">
                  {company}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center space-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mx-auto">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-3xl md:text-4xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Our <span className="gradient-text">Top Courses</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our most popular courses loved by thousands of students worldwide.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coursesToShow.length > 0 ? (
                coursesToShow.map((course, index) => (
                  <div
                    key={course._id || index}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CourseCard course={course} />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-muted-foreground">
                  No courses found at the moment.
                </div>
              )}
            </div>
          )}

          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/courses')}
              className="gap-2"
            >
              View All Courses
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Why Choose <span className="gradient-text">LMS System</span>?
                </h2>
                <p className="text-muted-foreground text-lg">
                  We're committed to providing the best learning experience with cutting-edge technology and world-class instructors.
                </p>
              </div>

              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div
                    key={feature.title}
                    className="flex gap-4 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex-shrink-0 h-12 w-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
                      <feature.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Features Grid */}
            <div className="relative">
              <div className="absolute inset-0 gradient-primary opacity-10 rounded-3xl blur-3xl" />
              <div className="relative bg-card rounded-3xl border border-border p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center">
                    <GraduationCap className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Start Learning Today</h3>
                    <p className="text-muted-foreground">Join thousands of learners</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    '24/7 Access to all courses',
                    'Learn at your own pace',
                    'Mobile-friendly platform',
                    'Community support',
                    'Regular content updates',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <Button
                  variant="hero"
                  className="w-full"
                  size="lg"
                  onClick={() => navigate('/signup')}
                >
                  Get Started Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl gradient-primary p-12 md:p-16 text-center">
            <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-10" />
            <div className="relative space-y-6 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
                Ready to Start Your Learning Journey?
              </h2>
              <p className="text-primary-foreground/80 text-lg">
                Join our community of learners and get access to thousands of courses, expert instructors, and a supportive community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {
                  !user && (
                    <Button
                      variant="secondary"
                      size="xl"
                      onClick={() => navigate('/signup')}
                      className="bg-background text-foreground hover:bg-background/90"
                    >
                      Create Free Account
                    </Button>
                  )
                }
                <Button
                  variant="outline"
                  size="xl"
                  onClick={() => navigate('/courses')}
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Browse Courses
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
