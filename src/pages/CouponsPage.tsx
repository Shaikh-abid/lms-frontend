import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useCouponStore } from '@/store/couponStore';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Ticket, 
  Copy, 
  Check, 
  Search, 
  Calendar, 
  Percent,
  Clock,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

const CouponsPage = () => {
  const { getActiveCoupons } = useCouponStore();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const activeCoupons = getActiveCoupons();

  const filteredCoupons = activeCoupons.filter(
    (coupon) =>
      coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coupon.courseName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success('Coupon code copied to clipboard!');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDaysRemaining = (validUntil: string) => {
    const now = new Date();
    const end = new Date(validUntil);
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Special Offers</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold gradient-text">
              Available Coupons
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover amazing discounts on our top courses. Use these codes at checkout to save big!
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by course name or coupon code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-lg"
            />
          </div>
        </div>
      </section>

      {/* Coupons Grid */}
      <section className="py-8 pb-20">
        <div className="container mx-auto px-4">
          {filteredCoupons.length === 0 ? (
            <div className="text-center py-16">
              <Ticket className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No coupons available</h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? 'No coupons match your search'
                  : 'Check back later for new offers!'}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCoupons.map((coupon) => {
                const daysRemaining = getDaysRemaining(coupon.validUntil);
                const usesRemaining = coupon.maxUses - coupon.currentUses;
                const isExpiringSoon = daysRemaining <= 7;

                return (
                  <Card
                    key={coupon.id}
                    className="glass border-border/50 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Discount Banner */}
                    <div className="relative gradient-primary p-6 text-primary-foreground">
                      <div className="absolute top-2 right-2">
                        {isExpiringSoon && (
                          <Badge variant="secondary" className="bg-destructive/20 text-destructive-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            Expiring Soon
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
                          <Percent className="h-8 w-8" />
                        </div>
                        <div>
                          <div className="text-4xl font-bold">{coupon.discountPercent}%</div>
                          <div className="text-sm opacity-90">OFF</div>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-6 space-y-4">
                      {/* Course Name */}
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Valid for</p>
                        <h3 className="font-semibold line-clamp-2">{coupon.courseName}</h3>
                      </div>

                      {/* Coupon Code */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 px-4 py-3 bg-muted rounded-lg border-2 border-dashed border-border">
                          <code className="text-lg font-mono font-bold">{coupon.code}</code>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(coupon.code)}
                          className="h-12 w-12"
                        >
                          {copiedCode === coupon.code ? (
                            <Check className="h-5 w-5 text-success" />
                          ) : (
                            <Copy className="h-5 w-5" />
                          )}
                        </Button>
                      </div>

                      {/* Details */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t border-border/50">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Valid until {formatDate(coupon.validUntil)}</span>
                        </div>
                        <Badge variant="secondary">
                          {usesRemaining} left
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default CouponsPage;
