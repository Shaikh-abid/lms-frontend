import MainLayout from '@/components/layout/MainLayout';
import { useCartStore } from '@/store/cartStore';
import { useCourseStore } from '@/store/courseStore';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const CartPage = () => {
  const { items, removeFromCart, clearCart, getTotal } = useCartStore();
  const { purchaseCourses } = useCourseStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (items.length === 0) return;
    
    purchaseCourses(items);
    clearCart();
    toast({
      title: 'Purchase Successful! 🎉',
      description: 'Your courses are now available in My Courses.',
    });
    navigate('/my-courses');
  };

  if (items.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="h-24 w-24 mx-auto rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold">Your cart is empty</h1>
            <p className="text-muted-foreground">
              Explore our courses and add something you'd like to learn!
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
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <p className="text-muted-foreground">{items.length} Course(s) in Cart</p>
            
            {items.map((course) => (
              <div
                key={course.id}
                className="flex gap-4 p-4 bg-card rounded-xl border border-border"
              >
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-32 h-20 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold line-clamp-1">{course.title}</h3>
                  <p className="text-sm text-muted-foreground">{course.instructor}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-bold text-primary">₹{course.price}</span>
                    {course.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{course.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => removeFromCart(course.id)}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border p-6 sticky top-24 space-y-6">
              <h2 className="text-xl font-semibold">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{getTotal()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="text-success">-₹0</span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{getTotal()}</span>
                  </div>
                </div>
              </div>

              <Button
                variant="gradient"
                className="w-full"
                size="lg"
                onClick={handleCheckout}
              >
                Checkout
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                30-Day Money-Back Guarantee
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CartPage;
