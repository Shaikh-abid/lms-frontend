import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Users,
  DollarSign,
  BookOpen,
  TrendingUp,
  Plus,
  MoreVertical,
  Edit,
  EyeOff,
  Eye,
  BarChart3,
  Brush,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import CouponManager from '@/components/instructor/CouponManager';
// Ensure these imports point to your actual API files
import {
  getAllInstructorCoursesApi,
  getInstructorAnalyticsApi,
  updateCourseApi
} from '@/backend-apis/courses-apis/courseCreation.apis';
import { toast } from 'sonner'; // Added for feedback

const InstructorDashboard = () => {
  const { user } = useAuthStore();
  const [courses, setCourses] = useState([]);

  // Stats State
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalHoursContent, setTotalHoursContent] = useState(0);

  // --- FIXED UPDATE LOGIC ---
  const togglePublish = async (courseId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    // 1. Create FormData (Required if backend uses multer/file upload middleware)
    const formData = new FormData();
    formData.append('isPublished', String(newStatus)); // Convert boolean to string

    try {
      // 2. Call API
      await updateCourseApi(formData, courseId);

      // 3. Update Local State (Crucial for UI reflection)
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course._id === courseId ? { ...course, isPublished: newStatus } : course
        )
      );

      toast.success(newStatus ? "Course published!" : "Course unpublished");
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error("Failed to update course status");
    }
  };

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getAllInstructorCoursesApi();
        // Handle cases where response might be { success: true, courses: [...] } or just [...]
        const courseData = response.courses || response || [];
        setCourses(courseData);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    const fetchAnalytics = async () => {
      try {
        const response = await getInstructorAnalyticsApi();
        if (response) {
          setTotalStudents(response.totalStudents || 0);
          setTotalRevenue(response.totalRevenue || 0);
          setTotalCourses(response.totalCourses || 0);
          setTotalHoursContent(response.totalHours || 0);
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    if (user) {
      fetchCourses();
      fetchAnalytics();
    }
  }, [user]);

  const stats = [
    {
      title: 'Total Students',
      value: totalStudents,
      icon: Users,
      changeType: 'positive' as const,
    },
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue}`,
      icon: DollarSign,
      changeType: 'positive' as const,
    },
    {
      title: 'Total Courses',
      value: totalCourses,
      icon: BookOpen,
      change: `${totalCourses} total`,
      changeType: 'neutral' as const,
    },
    {
      title: 'Total Hours Content',
      value: totalHoursContent,
      icon: TrendingUp,
      changeType: 'positive' as const,
    },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text">
              Instructor Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user?.name || 'Instructor'}! Here's your course overview.
            </p>
          </div>
          <Button variant="gradient" asChild>
            <Link to="/instructor/courses/new">
              <Plus className="mr-2 h-4 w-4" />
              Create New Course
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="glass border-border/50 hover:shadow-glow transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    {stat.change && (
                      <p className={`text-xs mt-1 ${stat.changeType === 'positive' ? 'text-green-500' : 'text-muted-foreground'}`}>
                        {stat.change}
                      </p>
                    )}
                  </div>
                  <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Revenue Chart Placeholder */}
        <Card className="glass border-border/50 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Revenue Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Revenue chart will be displayed here</p>
                <p className="text-sm text-muted-foreground/70">Connect to backend for real data</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Courses Table */}
        <Card className="glass border-border/50">
          {courses.length > 0 ? (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Your Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Course</TableHead>
                        <TableHead>Students</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead>Total Hours</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courses.map((course) => (
                        <TableRow key={course._id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img
                                src={course.thumbnail}
                                alt={course.courseTitle}
                                className="h-12 w-20 object-cover rounded-lg"
                              />
                              <div>
                                <p className="font-medium line-clamp-1 max-w-[200px]">
                                  {course.courseTitle}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {course.category}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              {course.studentsEnrolled?.length || 0}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            ₹{(course.price || 0) * (course.studentsEnrolled?.length || 0)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-500">★</span>
                              {course.duration || 0} hrs
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={course.isPublished ? 'default' : 'secondary'}
                              className={course.isPublished ? 'bg-green-500/20 text-green-500' : ''}
                            >
                              {course.isPublished ? 'Published' : 'Draft'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link to={`/instructor/courses/${course._id}/edit`}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Course
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  // Pass course ID and current status
                                  onClick={() => togglePublish(course._id, course.isPublished)}
                                >
                                  {course.isPublished ? (
                                    <>
                                      <EyeOff className="mr-2 h-4 w-4" />
                                      Unpublish
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="mr-2 h-4 w-4" />
                                      Publish
                                    </>
                                  )}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </>
          ) : (
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Your Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center h-full gap-3 py-10">
                  <p className="text-center text-muted-foreground">
                    No courses available
                  </p>
                  <p className="text-center text-muted-foreground flex items-center gap-2">
                    Create a course to get started <Brush className="h-7 w-7" />
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </Card>

        {/* Coupon Management */}
        <div className="mt-8">
          <CouponManager />
        </div>
      </div>
    </MainLayout>
  );
};

export default InstructorDashboard;