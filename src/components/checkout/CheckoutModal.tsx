import { useState } from 'react';
import { useAuthStore } from '@/store/authStore'; // 1. Import Auth Store
import { Course } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    CreditCard,
    Lock,
    CheckCircle,
    ShieldCheck,
} from 'lucide-react';
import { purchaseCourseCommonViewApi } from '@/backend-apis/student-apis/student.api';
import { toast } from 'sonner'; // 2. Import Toast (assuming you use Sonner or similar)

interface CheckoutModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    courses: Course[];
    onCheckoutComplete: () => void;
}

const CheckoutModal = ({ open, onOpenChange, courses, onCheckoutComplete }: CheckoutModalProps) => {
    const { user } = useAuthStore(); // 3. Get Logged In User
    const [isProcessing, setIsProcessing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
    });

    const total = courses.reduce((sum, course) => sum + course.price, 0);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'cardNumber') {
            const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
            setFormData(prev => ({ ...prev, [name]: formatted.slice(0, 19) }));
        } else if (name === 'expiryDate') {
            const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
            setFormData(prev => ({ ...prev, [name]: formatted.slice(0, 5) }));
        } else if (name === 'cvv') {
            setFormData(prev => ({ ...prev, [name]: value.slice(0, 3) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // --------------------------------------------------------
    // THE MAIN INTEGRATION LOGIC IS HERE
    // --------------------------------------------------------
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (courses.length === 0) {
            toast.error("Cart is empty");
            return;
        }

        setIsProcessing(true);

        try {
            // Loop through each course and create an order
            // This ensures every course gets its own Order ID and DB Entry
            for (const course of courses) {
                const orderPayload = {
                    userId: user?._id, // Critical: Links purchase to account
                    userName: user?.name || formData.fullName,
                    userEmail: user?.email || formData.email,
                    orderStatus: "confirmed",
                    paymentMethod: "Credit Card (Dummy)",
                    paymentStatus: "paid",
                    orderDate: new Date(),
                    paymentId: `DUMMY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Fake Trans ID
                    instructorId: course.instructor?._id, // Ensure your Course object has this
                    instructorName: course.instructor?.name,
                    courseImage: course.thumbnail,
                    courseTitle: course.courseTitle,
                    courseId: course._id,
                    coursePricing: course.price // Sends the discounted price if applicable
                };

                await purchaseCourseCommonViewApi(orderPayload);
            }

            // If loop finishes without error:
            setIsProcessing(false);
            toast.success('Payment Successful! Start Learning 🚀');
            onCheckoutComplete(); // Trigger parent cleanup (clear cart, redirect)
            onOpenChange(false); // Close modal

        } catch (error) {
            console.error(error);
            setIsProcessing(false);
            toast.error('Payment failed. Please try again.');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center">
                            <CreditCard className="h-5 w-5 text-primary-foreground" />
                        </div>
                        Complete Your Purchase
                    </DialogTitle>
                </DialogHeader>

                <div className="grid md:grid-cols-2 gap-6 mt-4">
                    {/* Order Summary */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Order Summary</h3>
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                            {courses.map((course) => (
                                <div
                                    key={course._id}
                                    className="flex gap-3 p-3 bg-muted/50 rounded-lg"
                                >
                                    <img
                                        src={course.thumbnail}
                                        alt={course.courseTitle}
                                        className="w-16 h-12 object-cover rounded"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-sm line-clamp-1">{course.courseTitle}</h4>
                                        <p className="text-xs text-muted-foreground">{course.instructor?.name}</p>
                                        <p className="font-semibold text-primary mt-1">₹{course.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-border pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal ({courses.length} items)</span>
                                <span>₹{total}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Tax</span>
                                <span>₹0</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                                <span>Total</span>
                                <span className="text-primary">₹{total}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <h3 className="font-semibold text-lg">Payment Details</h3>

                        <div className="space-y-3">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input
                                    id="fullName"
                                    name="fullName"
                                    placeholder="John Doe"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="cardNumber">Card Number</Label>
                                <div className="relative">
                                    <Input
                                        id="cardNumber"
                                        name="cardNumber"
                                        placeholder="1234 5678 9012 3456"
                                        value={formData.cardNumber}
                                        onChange={handleInputChange}
                                        required
                                        className="pr-12"
                                    />
                                    <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label htmlFor="expiryDate">Expiry Date</Label>
                                    <Input
                                        id="expiryDate"
                                        name="expiryDate"
                                        placeholder="MM/YY"
                                        value={formData.expiryDate}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cvv">CVV</Label>
                                    <Input
                                        id="cvv"
                                        name="cvv"
                                        type="password"
                                        placeholder="•••"
                                        value={formData.cvv}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            variant="gradient" // Assuming you have this variant
                            className="w-full"
                            size="lg"
                            disabled={isProcessing}
                        >
                            {isProcessing ? (
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                    Processing...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Lock className="h-4 w-4" />
                                    Pay ₹{total}
                                </div>
                            )}
                        </Button>

                        <div className="flex items-center justify-center gap-4 pt-2">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <ShieldCheck className="h-4 w-4 text-success" />
                                Secure Payment
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <CheckCircle className="h-4 w-4 text-success" />
                                30-Day Guarantee
                            </div>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CheckoutModal;