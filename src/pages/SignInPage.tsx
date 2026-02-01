import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap, Mail, Lock, ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { loginApi } from '@/backend-apis/auth-apis/auth.apis';
import { useCourseStore } from '@/store/courseStore';

const SignInPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { syncPurchasedCourses } = useCourseStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const loginResponse = await loginApi({ email, password })
      console.log("login response in sign in page: ", loginResponse)

      login({
        _id: loginResponse.data._id,
        name: loginResponse.data.name,
        email: loginResponse.data.email,
        role: loginResponse.data.role,
        avatar: loginResponse.data.avatar,
      });

      // 3. Load Courses into Store
      // We check if the array exists and has items
      if (loginResponse.data.enrolledCourses && Array.isArray(loginResponse.data.enrolledCourses)) {
        syncPurchasedCourses(loginResponse.data.enrolledCourses);
      }

      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in.',
      });

      navigate(loginResponse.data.role === 'instructor' ? '/instructor/dashboard' : '/');
    } catch (error) {
      console.error("Login Error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Something went wrong";

      toast({
        title: 'Login Failed',
        description: errorMessage,
        variant: 'destructive',
      });

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold gradient-text">LMS System</span>
          </Link>

          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground">
              Sign in to your account to continue learning
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {/* <a href="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </a> */}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="gradient"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link to="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </div>

          {/* Demo Accounts */}
          <div className="bg-muted rounded-xl p-4 space-y-2">
            <p className="text-sm font-medium">Demo Accounts:</p>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Student: student@demo.com</p>
              <p>Instructor: instructor@demo.com</p>
              <p>(Any password works)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:flex flex-1 gradient-hero items-center justify-center p-8">
        <div className="max-w-md text-center text-primary-foreground space-y-6">
          <div className="h-20 w-20 mx-auto rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
            <GraduationCap className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-bold">Start Learning Today</h2>
          <p className="text-primary-foreground/80">
            Access thousands of courses and start building the skills that will shape your future.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
