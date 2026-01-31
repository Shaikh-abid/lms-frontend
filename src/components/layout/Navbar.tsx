import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { ShoppingCart, Menu, X, GraduationCap, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { items } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/courses', label: 'Courses' },
    { path: '/coupons', label: 'Coupons' },
    { path: '/about', label: 'About Us' },
  ];

  const handleLogout = () => {
    localStorage.clear();
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-glow transition-transform group-hover:scale-110">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold gradient-text">LMS System</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${isActive(link.path)
                    ? 'text-primary'
                    : 'text-muted-foreground'
                  }`}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && user?.role === 'student' && (
              <Link
                to="/my-courses"
                className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/my-courses')
                    ? 'text-primary'
                    : 'text-muted-foreground'
                  }`}
              >
                My Courses
              </Link>
            )}
            {isAuthenticated && user?.role === 'instructor' && (
              <Link
                to="/instructor/dashboard"
                className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname.startsWith('/instructor')
                    ? 'text-primary'
                    : 'text-muted-foreground'
                  }`}
              >
                Instructor Dashboard
              </Link>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Cart */}
            {
              user && (
                <Link to="/cart" className="relative">
                  <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {items.length > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs gradient-accent border-0">
                        {items.length}
                      </Badge>
                    )}
                  </Button>
                </Link>
              )
            }

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback className="gradient-primary text-primary-foreground">
                        {user?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user?.name}</span>
                      <span className="text-xs text-muted-foreground">{user?.email}</span>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <User className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => navigate('/signin')}>
                  Sign In
                </Button>
                <Button variant="gradient" onClick={() => navigate('/signup')}>
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors ${isActive(link.path) ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && user?.role === 'student' && (
                <Link
                  to="/my-courses"
                  className="text-sm font-medium text-muted-foreground"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Courses
                </Link>
              )}
              {isAuthenticated && user?.role === 'instructor' && (
                <Link
                  to="/instructor/dashboard"
                  className="text-sm font-medium text-muted-foreground"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Instructor Dashboard
                </Link>
              )}
              <div className="flex flex-col gap-2 pt-4 border-t border-border/50">
                {isAuthenticated ? (
                  <>
                    <Button variant="outline" onClick={() => navigate('/settings')}>
                      Settings
                    </Button>
                    <Button variant="destructive" onClick={handleLogout}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => navigate('/signin')}>
                      Sign In
                    </Button>
                    <Button variant="gradient" onClick={() => navigate('/signup')}>
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
