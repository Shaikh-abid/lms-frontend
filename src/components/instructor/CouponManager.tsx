import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Ticket, Calendar, Percent, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Import APIs
import {
  createCouponApi,
  getInstructorCouponsApi,
  deleteCouponApi,
  updateCouponStatusApi
} from "@/backend-apis/coupons-apis/coupons.api";
import { getAllInstructorCoursesApi } from '@/backend-apis/courses-apis/courseCreation.apis';

const CouponManager = () => {
  // State for Data
  const [coupons, setCoupons] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form State
  const [code, setCode] = useState('');
  const [courseId, setCourseId] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [validFrom, setValidFrom] = useState('');
  const [validUntil, setValidUntil] = useState('');
  // const [maxUses, setMaxUses] = useState('');

  // 1. Fetch Coupons & Courses on Load
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [couponsData, coursesData] = await Promise.all([
        getInstructorCouponsApi(),
        getAllInstructorCoursesApi()
      ]);
      setCoupons(couponsData);
      setCourses(coursesData.courses);
    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. Handle Create Coupon
  const handleCreateCoupon = async () => {
    if (!code || !courseId || !discountPercent || !validFrom || !validUntil) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsCreating(true);
    try {
      const payload = {
        code,
        courseId,
        discountPercentage: Number(discountPercent),
        validFrom,
        validUntil,
        // maxUses: Number(maxUses)
      };

      await createCouponApi(payload);

      toast.success('Coupon created successfully!');
      setIsDialogOpen(false);
      resetForm();
      fetchData(); // Refresh list
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to create coupon');
    } finally {
      setIsCreating(false);
    }
  };

  // 3. Handle Delete Coupon
  const handleDeleteCoupon = async (id) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;

    try {
      await deleteCouponApi(id);
      toast.success("Coupon deleted");
      setCoupons(prev => prev.filter(c => c._id !== id));
    } catch (error) {
      toast.error("Failed to delete coupon");
    }
  };

  // 4. Handle Status Toggle
  const handleToggleStatus = async (id, currentStatus) => {
    // Optimistic Update
    setCoupons(prev => prev.map(c =>
      c._id === id ? { ...c, isActive: !currentStatus } : c
    ));

    try {
      await updateCouponStatusApi(id, !currentStatus);
      toast.success("Status updated");
    } catch (error) {
      setCoupons(prev => prev.map(c =>
        c._id === id ? { ...c, isActive: currentStatus } : c
      ));
      toast.error("Failed to update status");
    }
  };

  const resetForm = () => {
    setCode('');
    setCourseId('');
    setDiscountPercent('');
    setValidFrom('');
    setValidUntil('');
    // setMaxUses('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card className="glass border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Ticket className="h-5 w-5 text-primary" />
          Coupon Management
        </CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            {/* RESTORED OLD STYLE: Removed hardcoded colors, used variant="gradient" */}
            <Button variant="gradient" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Create Coupon
            </Button>
          </DialogTrigger>

          {/* REMOVED 'bg-white' to fix Dark Mode */}
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5 text-primary" />
                Create New Coupon
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="code">Coupon Code</Label>
                <Input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g., SUMMER50"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label>Select Course</Label>
                <Select value={courseId} onValueChange={setCourseId}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Choose a course" />
                  </SelectTrigger>
                  {/* REMOVED 'bg-white' here too */}
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course._id} value={course._id}>
                        {course.courseTitle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="discount">Discount Percentage</Label>
                <div className="relative mt-1.5">
                  <Input
                    id="discount"
                    type="number"
                    min="1"
                    max="100"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    placeholder="e.g., 30"
                    className="pr-10"
                  />
                  <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="validFrom">Valid From</Label>
                  <Input
                    id="validFrom"
                    type="date"
                    value={validFrom}
                    onChange={(e) => setValidFrom(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="validUntil">Valid Until</Label>
                  <Input
                    id="validUntil"
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
              </div>

              {/* <div>
                <Label htmlFor="maxUses">Maximum Uses</Label>
                <Input
                  id="maxUses"
                  type="number"
                  min="1"
                  value={maxUses}
                  onChange={(e) => setMaxUses(e.target.value)}
                  placeholder="e.g., 100"
                  className="mt-1.5"
                />
              </div> */}

              {/* RESTORED OLD STYLE BUTTON */}
              <Button
                onClick={handleCreateCoupon}
                className="w-full"
                variant="gradient"
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                  </>
                ) : 'Create Coupon'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-12 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Ticket className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No coupons created yet</p>
            <p className="text-sm">Create your first coupon to offer discounts</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Validity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.map((coupon) => (
                  <TableRow key={coupon._id}>
                    <TableCell>
                      <code className="px-2 py-1 bg-muted rounded font-mono font-semibold">
                        {coupon.code}
                      </code>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {coupon.courseId?.courseTitle || 'Unknown Course'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{coupon.discountPercentage}%</Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(coupon.validUntil)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={coupon.isActive}
                        onCheckedChange={() => handleToggleStatus(coupon._id, coupon.isActive)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteCoupon(coupon._id)}
                        className="text-destructive hover:text-destructive hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CouponManager;