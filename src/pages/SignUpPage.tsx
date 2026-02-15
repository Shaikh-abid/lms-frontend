import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { GraduationCap, Mail, Lock, User, ArrowRight, EyeClosed, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

import { registerApi } from '@/backend-apis/auth-apis/auth.apis';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'instructor'>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const signUpResponse = await registerApi({ name, email, password, role });
    // console.log(signUpResponse);

    if (signUpResponse.status === 201) {
      login({
        _id: signUpResponse.data._id,
        name: signUpResponse.data.name,
        email: signUpResponse.data.email,
        role: signUpResponse.data.role,
      });
    }
    toast({
      title: 'Account created!',
      description: `Welcome ${signUpResponse.data.name} to LMS System. Start your learning journey!`,
    });
    setIsLoading(false);
    navigate(role === 'instructor' ? '/instructor/dashboard' : '/');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex flex-1 gradient-hero items-center justify-center p-8">
        <div className="max-w-md text-center text-primary-foreground space-y-6">
          <div className="h-20 w-20 mx-auto rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
            <GraduationCap className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-bold">Join Our Community</h2>
          <p className="text-primary-foreground/80">
            Create an account and get access to thousands of courses from expert instructors.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
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
            <h1 className="text-3xl font-bold">Create an account</h1>
            <p className="text-muted-foreground">
              Start your learning journey today
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

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
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeClosed className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <Label>I want to</Label>
                <RadioGroup
                  value={role}
                  onValueChange={(value) => setRole(value as 'student' | 'instructor')}
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <RadioGroupItem
                      value="student"
                      id="student"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="student"
                      className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <span className="text-2xl mb-2">📚</span>
                      <span className="font-medium">Learn</span>
                      <span className="text-xs text-muted-foreground">
                        Take courses
                      </span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="instructor"
                      id="instructor"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="instructor"
                      className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <span className="text-2xl mb-2">🎓</span>
                      <span className="font-medium">Teach</span>
                      <span className="text-xs text-muted-foreground">
                        Create courses
                      </span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <Button
              type="submit"
              variant="gradient"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link to="/signin" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
