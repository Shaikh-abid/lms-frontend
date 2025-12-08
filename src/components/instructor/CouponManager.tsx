import { useState } from 'react';
import { useCouponStore, Coupon } from '@/store/couponStore';
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
import { Plus, Trash2, Ticket, Calendar, Percent } from 'lucide-react';
import { toast } from 'sonner';
import { mockCourses } from '@/data/courses';

interface CouponManagerProps {
  instructorId?: string;
}

const CouponManager = ({ instructorId = 'instructor-1' }: CouponManagerProps) => {
  const { coupons, addCoupon, removeCoupon, toggleCouponStatus } = useCouponStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form state
  const [code, setCode] = useState('');
  const [courseId, setCourseId] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [validFrom, setValidFrom] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [maxUses, setMaxUses] = useState('');

  const instructorCoupons = coupons.filter((c) => c.createdBy === instructorId);

  const handleCreateCoupon = () => {
    if (!code || !courseId || !discountPercent || !validFrom || !validUntil || !maxUses) {
      toast.error('Please fill in all fields');
      return;
    }

    const course = mockCourses.find((c) => c.id === courseId);
    if (!course) {
      toast.error('Course not found');
      return;
    }

    addCoupon({
      code: code.toUpperCase(),
      courseId,
      courseName: course.title,
      discountPercent: parseInt(discountPercent),
      validFrom,
      validUntil,
      maxUses: parseInt(maxUses),
      isActive: true,
      createdBy: instructorId,
    });

    toast.success('Coupon created successfully!');
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setCode('');
    setCourseId('');
    setDiscountPercent('');
    setValidFrom('');
    setValidUntil('');
    setMaxUses('');
  };

  const formatDate = (dateString: string) => {
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
            <Button variant="gradient" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Create Coupon
            </Button>
          </DialogTrigger>
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
                  <SelectContent>
                    {mockCourses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
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

              <div>
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
              </div>

              <Button onClick={handleCreateCoupon} className="w-full" variant="gradient">
                Create Coupon
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {instructorCoupons.length === 0 ? (
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
                  <TableHead>Uses</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {instructorCoupons.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell>
                      <code className="px-2 py-1 bg-muted rounded font-mono font-semibold">
                        {coupon.code}
                      </code>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {coupon.courseName}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{coupon.discountPercent}%</Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(coupon.validUntil)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {coupon.currentUses}/{coupon.maxUses}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={coupon.isActive}
                        onCheckedChange={() => toggleCouponStatus(coupon.id)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCoupon(coupon.id)}
                        className="text-destructive hover:text-destructive"
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
