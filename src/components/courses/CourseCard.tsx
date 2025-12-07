import { Course } from '@/store/cartStore';
import { useCartStore } from '@/store/cartStore';
import { useCourseStore } from '@/store/courseStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, Users, ShoppingCart, Play, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCartStore();
  const { isPurchased } = useCourseStore();

  const inCart = isInCart(course.id);
  const purchased = isPurchased(course.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!inCart && !purchased) {
      addToCart(course);
    }
  };

  const handleCardClick = () => {
    if (purchased) {
      navigate(`/course/${course.id}/learn`);
    } else {
      navigate(`/course/${course.id}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-card rounded-2xl border border-border overflow-hidden hover-lift cursor-pointer card-shine"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {course.isBestseller && (
            <Badge className="gradient-accent text-accent-foreground border-0 text-xs font-semibold">
              Bestseller
            </Badge>
          )}
          {course.isNew && (
            <Badge className="bg-success text-success-foreground border-0 text-xs font-semibold">
              New
            </Badge>
          )}
          {purchased && (
            <Badge className="bg-success text-success-foreground border-0 text-xs font-semibold flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Purchased
            </Badge>
          )}
        </div>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="h-14 w-14 rounded-full gradient-primary flex items-center justify-center shadow-glow">
            <Play className="h-6 w-6 text-primary-foreground ml-1" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Category & Level */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-primary font-medium">{course.category}</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">{course.level}</span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>

        {/* Instructor */}
        <p className="text-sm text-muted-foreground">by {course.instructor}</p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-accent fill-accent" />
            <span className="font-medium">{course.rating}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{course.studentsCount.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{course.duration}</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">₹{course.price}</span>
            {course.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{course.originalPrice}
              </span>
            )}
          </div>
          
          {purchased ? (
            <Button size="sm" variant="gradient" className="gap-2">
              <Play className="h-4 w-4" />
              Continue
            </Button>
          ) : inCart ? (
            <Button size="sm" variant="secondary" disabled>
              <CheckCircle className="h-4 w-4 mr-1" />
              In Cart
            </Button>
          ) : (
            <Button size="sm" variant="gradient" onClick={handleAddToCart} className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              Add
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
