import { useState } from 'react';
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
} from 'lucide-react';
import { mockCourses } from '@/data/courses';
import { useAuthStore } from '@/store/authStore';

// Mock instructor courses (filter by instructor)
const instructorCourses = mockCourses.slice(0, 4).map((course, index) => ({
  ...course,
  isPublished: index !== 2,
  enrollments: Math.floor(Math.random() * 5000) + 500,
  revenue: Math.floor(Math.random() * 50000) + 5000,
}));

const InstructorDashboard = () => {
  const { user } = useAuthStore();
  const [courses, setCourses] = useState(instructorCourses);

  const totalStudents = courses.reduce((acc, course) => acc + course.enrollments, 0);
  const totalRevenue = courses.reduce((acc, course) => acc + course.revenue, 0);
  const totalCourses = courses.length;
  const publishedCourses = courses.filter((c) => c.isPublished).length;

  const togglePublish = (courseId: string) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === courseId
          ? { ...course, isPublished: !course.isPublished }
          : course
      )
    );
  };

  const stats = [
    {
      title: 'Total Students',
      value: totalStudents.toLocaleString(),
      icon: Users,
      change: '+12.5%',
      changeType: 'positive' as const,
    },
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      change: '+8.2%',
      changeType: 'positive' as const,
    },
    {
      title: 'Published Courses',
      value: publishedCourses,
      icon: BookOpen,
      change: `${totalCourses} total`,
      changeType: 'neutral' as const,
    },
    {
      title: 'Avg. Rating',
      value: '4.8',
      icon: TrendingUp,
      change: '+0.3',
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
          {stats.map((stat) => (
            <Card key={stat.title} className="glass border-border/50 hover:shadow-glow transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <p
                      className={`text-xs mt-1 ${
                        stat.changeType === 'positive'
                          ? 'text-green-500'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {stat.change}
                    </p>
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
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="h-12 w-20 object-cover rounded-lg"
                          />
                          <div>
                            <p className="font-medium line-clamp-1 max-w-[200px]">
                              {course.title}
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
                          {course.enrollments.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        ₹{course.revenue.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          {course.rating}
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
                              <Link to={`/instructor/courses/${course.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Course
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => togglePublish(course.id)}>
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
        </Card>
      </div>
    </MainLayout>
  );
};

export default InstructorDashboard;
