import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { mockCourses } from '@/data/courses';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/cartStore';
import { useCourseStore } from '@/store/courseStore';
import {
  Star,
  Clock,
  Users,
  Globe,
  BarChart3,
  PlayCircle,
  CheckCircle,
  ShoppingCart,
  Play,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCartStore();
  const { isPurchased } = useCourseStore();

  const course = mockCourses.find((c) => c.id === id);

  if (!course) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Course not found</h1>
          <Button onClick={() => navigate('/courses')} className="mt-4">
            Browse Courses
          </Button>
        </div>
      </MainLayout>
    );
  }

  const inCart = isInCart(course.id);
  const purchased = isPurchased(course.id);

  const handleAddToCart = () => {
    if (!inCart && !purchased) {
      addToCart(course);
    }
  };

  const totalLectures = course.curriculum?.reduce(
    (acc, section) => acc + section.lectures.length,
    0
  ) || 0;

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="gradient-hero py-12 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2 space-y-6 text-primary-foreground">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-0">
                  {course.category}
                </Badge>
                {course.isBestseller && (
                  <Badge className="gradient-accent border-0">Bestseller</Badge>
                )}
                {course.isNew && (
                  <Badge className="bg-success border-0">New</Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold">{course.title}</h1>
              <p className="text-lg text-primary-foreground/80">{course.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-accent text-accent" />
                  <span className="font-bold">{course.rating}</span>
                  <span className="text-primary-foreground/70">({course.studentsCount.toLocaleString()} students)</span>
                </div>
              </div>

              <p className="text-primary-foreground/80">
                Created by <span className="font-medium text-primary-foreground">{course.instructor}</span>
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-primary-foreground/80">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {course.duration}
                </div>
                <div className="flex items-center gap-1">
                  <BarChart3 className="h-4 w-4" />
                  {course.level}
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  {course.language}
                </div>
                <div className="flex items-center gap-1">
                  <PlayCircle className="h-4 w-4" />
                  {totalLectures} lectures
                </div>
              </div>
            </div>

            {/* Course Card */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden sticky top-24">
                <div className="aspect-video relative">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-foreground/20">
                    <div className="h-16 w-16 rounded-full gradient-primary flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-glow">
                      <Play className="h-8 w-8 text-primary-foreground ml-1" />
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold">₹{course.price}</span>
                    {course.originalPrice && (
                      <>
                        <span className="text-lg text-muted-foreground line-through">
                          ₹{course.originalPrice}
                        </span>
                        <Badge variant="secondary">
                          {Math.round((1 - course.price / course.originalPrice) * 100)}% off
                        </Badge>
                      </>
                    )}
                  </div>

                  {purchased ? (
                    <Button
                      variant="gradient"
                      className="w-full"
                      size="lg"
                      onClick={() => navigate(`/course/${course.id}/learn`)}
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Continue Learning
                    </Button>
                  ) : inCart ? (
                    <Button
                      variant="secondary"
                      className="w-full"
                      size="lg"
                      onClick={() => navigate('/cart')}
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Go to Cart
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <Button
                        variant="gradient"
                        className="w-full"
                        size="lg"
                        onClick={handleAddToCart}
                      >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Add to Cart
                      </Button>
                      <Button variant="outline" className="w-full" size="lg">
                        Buy Now
                      </Button>
                    </div>
                  )}

                  <div className="space-y-3 text-sm">
                    <p className="font-semibold">This course includes:</p>
                    {[
                      `${course.duration} of video content`,
                      'Full lifetime access',
                      'Access on mobile and desktop',
                      'Certificate of completion',
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className="text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold mb-6">Course Curriculum</h2>
            
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <Accordion type="multiple" className="w-full">
                {course.curriculum?.map((section, sectionIndex) => (
                  <AccordionItem key={section.id} value={section.id}>
                    <AccordionTrigger className="px-6 hover:no-underline hover:bg-muted/50">
                      <div className="flex items-center gap-4">
                        <span className="font-semibold">
                          Section {sectionIndex + 1}: {section.title}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {section.lectures.length} lectures
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-0">
                      <div className="divide-y divide-border">
                        {section.lectures.map((lecture) => (
                          <div
                            key={lecture.id}
                            className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <PlayCircle className="h-5 w-5 text-muted-foreground" />
                              <span>{lecture.title}</span>
                              {lecture.isFreePreview && (
                                <Badge variant="outline" className="text-xs">
                                  Preview
                                </Badge>
                              )}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {lecture.duration}
                            </span>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default CourseDetailPage;
