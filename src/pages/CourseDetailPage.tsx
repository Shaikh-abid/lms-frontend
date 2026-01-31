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
  Loader2,
  BookOpen,
  Target,
  Eye,
  X,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useEffect, useState } from 'react';
import { getCourseByIdinstructorViewApi } from '@/backend-apis/instructure-apis/instructure.api';
import { getCourseByIdStudentViewApi } from '@/backend-apis/student-apis/student.api';
import { applyCouponApi } from '@/backend-apis/coupons-apis/coupons.api';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/authStore';
import CheckoutModal from '@/components/checkout/CheckoutModal';
import { toast } from 'sonner';

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCartStore();
  const { isPurchased } = useCourseStore();
  const { user } = useAuthStore();
  const [showCheckout, setShowCheckout] = useState(false);
  const { purchaseCourses } = useCourseStore();

  const [courseDetails, setCourseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewVideo, setPreviewVideo] = useState<{ title: string; videoUrl: string } | null>(null);
  const [couponCodeStatus, setCouponCodeStatus] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  useEffect(() => {
    if (user?.role === "instructor") {
      const fetchCourseDetails = async () => {
        try {
          console.log(id);
          const response = await getCourseByIdinstructorViewApi(id);
          setCourseDetails(response);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching course details:', error);
          setLoading(false);
        }
      };
      fetchCourseDetails();
    } else {
      const fetchCourseDetails = async () => {
        try {
          console.log(id);
          const response = await getCourseByIdStudentViewApi(id);
          console.log(response);
          setCourseDetails(response.data?.courseDetails);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching course details:', error);
          setLoading(false);
        }
      };
      fetchCourseDetails();
    }
  }, [id, user]);

  const overviewList = courseDetails?.courseOverview
    ? courseDetails.courseOverview.split(/\r?\n/).filter(item => item.trim() !== '')
    : [];

  // 2. Convert coursePrerequisites string -> Array
  const prerequisitesList = courseDetails?.coursePrerequisites
    ? courseDetails.coursePrerequisites.split(/\r?\n/).filter(item => item.trim() !== '')
    : [];

  if (!courseDetails) {
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

  const inCart = isInCart(courseDetails._id);
  const purchased = isPurchased(courseDetails._id);

  const handleAddToCart = () => {
    if (!inCart && !purchased) {
      addToCart(courseDetails);
    }
  };

  const totalLectures = courseDetails.courseContent?.reduce(
    (acc, section) => acc + section.lectures.length,
    0
  ) || 0;

  const handleApplyCoupon = async (courseId) => {
    if (!couponCode.trim()) return;

    // Reset status while loading
    setCouponCodeStatus(null);

    try {
      // Call your API
      const response = await applyCouponApi(couponCode, courseId);

      if (response) {
        setCouponCodeStatus({
          type: 'success',
          message: `Coupon applied! You saved ${response.discountPercentage}%`
        });
        setAppliedDiscount(response.discountPercentage);
        setCouponCode('');
        // Optionally update price state here
      }
    } catch (error) {
      // Handle the specific backend error message
      const errorMsg = error.response?.data?.message || "Invalid coupon code";
      setCouponCodeStatus({ type: 'error', message: errorMsg });
      setCouponCode('');
    }
  };

  const finalPrice = appliedDiscount
    ? Math.round(courseDetails.price * (1 - appliedDiscount / 100))
    : courseDetails.price;

  const isCouponApplied = appliedDiscount > 0;

  return (
    <MainLayout>
      {/* Hero Section */}
      {
        loading ? (
          <div className="flex justify-center items-center h-screen">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <>


            <section className="gradient-hero py-12 lg:py-20">
              <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Course Info */}
                  <div className="lg:col-span-2 space-y-6 text-primary-foreground">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-0">
                        {courseDetails.category}
                      </Badge>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold">{courseDetails.courseTitle}</h1>
                    <p className="text-lg text-primary-foreground/80">{courseDetails.description}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 fill-accent text-accent" />
                        <span className="font-bold">{courseDetails.rating}</span>
                        <span className="text-primary-foreground/70">({courseDetails.studentsEnrolled.length.toLocaleString()} students)</span>
                      </div>
                    </div>

                    <p className="text-primary-foreground/80">
                      Created by <span className="font-medium text-primary-foreground">{courseDetails.instructor.name}</span>
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-primary-foreground/80">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {courseDetails.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <BarChart3 className="h-4 w-4" />
                        {courseDetails.level}
                      </div>
                      <div className="flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        {courseDetails.language}
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
                          src={courseDetails.thumbnail}
                          alt={courseDetails.courseTitle}
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

                          {/* 1. The Main Price (Changes if Coupon Applied) */}
                          <span className="text-3xl font-bold text-primary dark:text-primary-foreground">
                            ₹{finalPrice}
                          </span>

                          {/* 2. The Strikethrough Price (Conditional) */}
                          {(courseDetails.originalPrice || isCouponApplied) && (
                            <>
                              <span className="text-lg text-muted-foreground line-through">
                                {/* If coupon is active, strike out the Regular Price. 
              Otherwise, strike out the Original Price. */}
                                ₹{isCouponApplied ? courseDetails.price : courseDetails.originalPrice}
                              </span>

                              {/* 3. The Badge (Dynamic) */}
                              <Badge
                                variant={isCouponApplied ? "default" : "secondary"}
                                className={isCouponApplied ? "bg-green-500 hover:bg-green-600" : ""}
                              >
                                {isCouponApplied
                                  ? `Extra ${appliedDiscount}% Off` // Coupon Badge
                                  : `${Math.round((1 - courseDetails.price / courseDetails.originalPrice) * 100)}% off` // Standard Discount
                                }
                              </Badge>
                            </>
                          )}
                        </div>

                        {/* Optional: Show saved amount message */}
                        {isCouponApplied && (
                          <p className="text-sm text-green-600 font-medium">
                            You saved ₹{courseDetails.price - finalPrice} with this coupon!
                          </p>
                        )}

                        {purchased ? (
                          <Button
                            variant="gradient"
                            className="w-full"
                            size="lg"
                            onClick={() => navigate(`/course/${courseDetails._id}/learn`)}
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
                        ) : ( user &&
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
                            <Button variant="outline" className="w-full" size="lg" onClick={() => setShowCheckout(true)}>
                              Buy Now
                            </Button>
                          </div>
                        )}

                        {
                          purchased ? (
                            <></>
                          ) : ( user && 
                            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                              {/* Header */}
                              <div className="flex items-center gap-2">
                                <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center">
                                  <Target className="h-5 w-5 text-primary-foreground" />
                                </div>
                                <h2 className="text-xl font-bold">Coupon Code</h2>
                              </div>

                              {/* Input & Button Row */}
                              <div className="flex gap-3">
                                <Input
                                  type="text"
                                  placeholder="Enter coupon code"
                                  className="flex-1 uppercase placeholder:normal-case"
                                  value={couponCode}
                                  onChange={(e) => {
                                    setCouponCode(e.target.value);
                                    setCouponCodeStatus(null); // Clear error when user types
                                  }}
                                />
                                <Button
                                  onClick={() => handleApplyCoupon(courseDetails._id)}
                                  variant="gradient"
                                  size="default"
                                  disabled={!couponCode}
                                >
                                  Apply
                                </Button>
                              </div>

                              {/* Status Message (Below the input) */}
                              {couponCodeStatus && (
                                <div className={`text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-1 ${couponCodeStatus.type === 'error' ? 'text-destructive' : 'text-green-500'
                                  }`}>
                                  {couponCodeStatus.type === 'error' ? (
                                    // Error Icon & Message
                                    <>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                                      {couponCodeStatus.message}
                                    </>
                                  ) : (
                                    // Success Icon & Message
                                    <>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                                      {couponCodeStatus.message}
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          )
                        }



                        <div className="space-y-3 text-sm">
                          <p className="font-semibold">This course includes:</p>
                          {[
                            `${courseDetails.duration} hrs of video content`,
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


            {/* Course Overview and Prerequisites */}
            <section className="py-12 bg-muted/30">
              <div className="container mx-auto  px-4">
                <div className="max-w-7xl grid md:grid-cols-1 gap-8">

                  {/* What You'll Learn */}
                  {overviewList.length > 0 && (
                    <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center">
                          <Target className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <h2 className="text-xl font-bold">What You'll Learn</h2>
                      </div>
                      <ul className="space-y-3">
                        {overviewList.map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Prerequisites */}
                  {prerequisitesList.length > 0 && (
                    <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-accent" />
                        </div>
                        <h2 className="text-xl font-bold">Prerequisites</h2>
                      </div>
                      <ul className="space-y-3">
                        {prerequisitesList.map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-medium text-primary">{index + 1}</span>
                            </div>
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

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
                      {courseDetails.courseContent?.map((section, sectionIndex) => (
                        <AccordionItem key={section._id} value={section._id}>
                          <AccordionTrigger className="px-6 hover:no-underline hover:bg-muted/50">
                            <div className="flex items-center gap-4">
                              <span className="font-semibold">
                                Section {sectionIndex + 1}: {section.sectionTitle}
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
                                  key={lecture._id}
                                  className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <PlayCircle className="h-5 w-5 text-muted-foreground" />
                                    <span>{lecture.title}</span>
                                    {lecture.freePreview && (
                                      <Badge variant="outline" className="text-xs">
                                        Preview
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-3">
                                    {lecture.freePreview && lecture.videoUrl && (
                                      <button
                                        onClick={() => setPreviewVideo({ title: lecture.title, videoUrl: lecture.videoUrl! })}
                                        className="flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors"
                                      >
                                        <Eye className="h-4 w-4" />
                                        <span className="text-sm font-medium">Watch</span>
                                      </button>
                                    )}
                                    <span className="text-sm text-muted-foreground">
                                      {lecture?.duration}
                                    </span>
                                  </div>
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
            <Dialog open={!!previewVideo} onOpenChange={() => setPreviewVideo(null)}>
              <DialogContent className="sm:max-w-4xl p-0 overflow-hidden">
                <DialogHeader className="p-4 pb-0">
                  <div className="flex items-center justify-between">
                    <DialogTitle className="text-lg font-semibold pr-8">
                      {previewVideo?.title}
                    </DialogTitle>
                  </div>
                </DialogHeader>
                <div className="aspect-video w-full bg-black">
                  {previewVideo && (
                    <video
                      src={previewVideo.videoUrl}
                      controls
                      autoPlay
                      className="w-full h-full"
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}

      {/* Checkout Modal */}
      <CheckoutModal
        open={showCheckout}
        onOpenChange={setShowCheckout}
        courses={
          courseDetails
            ? [
              {
                ...courseDetails,
                // We override the database price with the calculated finalPrice
                price: finalPrice,
                // Optional: You can pass the original price too if your modal wants to show it
                originalPrice: courseDetails.price
              },
            ]
            : []
        }
        onCheckoutComplete={() => {
          purchaseCourses([courseDetails!]);
          toast.success('Purchase Successful! 🎉', {
            description: 'Your course is now available in My Courses.',
          });

          navigate(`/course/${courseDetails!._id}/learn`);
        }}
      />
    </MainLayout>
  );
};

export default CourseDetailPage;
