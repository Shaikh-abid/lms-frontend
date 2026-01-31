import { useState, useRef } from 'react'; // 1. Import useRef
import MainLayout from '@/components/layout/MainLayout';
import { useAuthStore } from '@/store/authStore';
import { useCourseStore } from '@/store/courseStore';
import { useThemeStore } from '@/store/themeStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sun, Moon, Monitor, Camera, Save, History, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';


import { updateUserProfileApi, changePasswordApi } from '@/backend-apis/auth-apis/auth.apis';

const SettingsPage = () => {
  const { user, updateUser, isAuthenticated } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const { purchasedCourses } = useCourseStore();
  const [showPurchaseHistory, setShowPurchaseHistory] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // 2. Create a reference for the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);


  if (!isAuthenticated) {
    navigate('/signin');
    return null;
  }

  // 3. Function to handle file selection
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAvatarFile(file); // ✅ REAL FILE (for backend)
    setAvatarPreview(URL.createObjectURL(file)); // ✅ preview only
  };


  // 4. Function to trigger the file input click
  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleSaveProfile = async () => {

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }


    try {
      const response = await updateUserProfileApi(formData);
      console.log(response);
      updateUser({ name: response?.data?.newUser?.name, email: response?.data?.newUser?.email, avatar: response?.data?.newUser?.avatar });
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error) {
      console.log(error);
    }
  };




  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <div className="space-y-8">
          {/* Profile Section */}
          <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
            <h2 className="text-xl font-semibold">Profile</h2>

            {/* Avatar */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-primary/20">
                  {/* 5. CHANGED: Use the 'avatar' state variable here instead of 'user?.avatar' so the preview shows */}
                  <AvatarImage src={avatarPreview} className="object-cover" />
                  <AvatarFallback className="text-2xl gradient-primary text-primary-foreground">
                    {user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* 6. The Button now triggers the hidden input */}
                <button
                  onClick={handleCameraClick}
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground shadow-lg hover:opacity-90 transition-opacity"
                >
                  <Camera className="h-4 w-4" />
                </button>

                {/* 7. Hidden Input for file selection */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{user?.name}</h3>
                <p className="text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </div>

            {/* Form */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <Button variant="gradient" onClick={handleSaveProfile} className="gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>

          {/* Theme Section */}
          <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
            <h2 className="text-xl font-semibold">Appearance</h2>
            <p className="text-muted-foreground">
              Choose how LMS System looks to you.
            </p>

            <RadioGroup
              value={theme}
              onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'system')}
              className="grid sm:grid-cols-3 gap-4"
            >
              <div>
                <RadioGroupItem value="light" id="light" className="peer sr-only" />
                <Label
                  htmlFor="light"
                  className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-popover p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-colors"
                >
                  <Sun className="h-8 w-8 mb-3 text-accent" />
                  <span className="font-medium">Light</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                <Label
                  htmlFor="dark"
                  className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-popover p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-colors"
                >
                  <Moon className="h-8 w-8 mb-3 text-primary" />
                  <span className="font-medium">Dark</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="system" id="system" className="peer sr-only" />
                <Label
                  htmlFor="system"
                  className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-popover p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-colors"
                >
                  <Monitor className="h-8 w-8 mb-3 text-muted-foreground" />
                  <span className="font-medium">System</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Account Section */}
          <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
            <h2 className="text-xl font-semibold">Account</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="font-medium">Change Password</p>
                  <p className="text-sm text-muted-foreground">
                    Update your password regularly for security
                  </p>
                </div>
                <Button variant="outline" onClick={() => setShowChangePassword(true)}>
                  <Lock className="h-4 w-4 mr-2" />
                  Change
                </Button>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="font-medium">See Your Purchase History</p>
                  <p className="text-sm text-muted-foreground">
                    See when and what course's you have purchased
                  </p>
                </div>
                <Button variant="outline" onClick={() => setShowPurchaseHistory(true)}>
                  <History className="h-4 w-4 mr-2" />
                  See
                </Button>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-destructive">Delete Account</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and data
                  </p>
                </div>
                <Button variant="destructive">Delete</Button>
              </div>
            </div>
          </div>
        </div>

        <Dialog open={showPurchaseHistory} onOpenChange={setShowPurchaseHistory}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Purchase History</DialogTitle>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              {purchasedCourses.length === 0 ? (
                <div className="text-center py-8">
                  <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No purchases yet</p>
                  <Button
                    variant="gradient"
                    className="mt-4"
                    onClick={() => {
                      setShowPurchaseHistory(false);
                      navigate('/courses');
                    }}
                  >
                    Browse Courses
                  </Button>
                </div>
              ) : (
                purchasedCourses.map((course) => (
                  <div
                    key={course._id}
                    className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card/50 hover:bg-card transition-colors"
                  >
                    <img
                      src={course.thumbnail}
                      alt={course.courseTitle}
                      className="w-20 h-14 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{course.courseTitle}</h4>
                      <p className="text-sm text-muted-foreground">{course.instructor.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">${course.price}</p>
                      <p className="text-xs text-muted-foreground">
                        {course.purchasedAt ? format(new Date(course.purchasedAt), 'MMM dd, yyyy') : 'N/A'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Change Password */}
        <Dialog open={showChangePassword} onOpenChange={(open) => {
          setShowChangePassword(open);
          if (!open) {
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setShowCurrentPassword(false);
            setShowNewPassword(false);
            setShowConfirmPassword(false);
          }
        }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <div className="p-2 rounded-full bg-primary/10">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                Change Password
              </DialogTitle>
            </DialogHeader>
            <div className="mt-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-sm font-medium">
                  Current Password
                </Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-medium">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  variant="gradient"
                  className="w-full"
                  onClick={() => {
                    if (!currentPassword || !newPassword || !confirmPassword) {
                      toast({
                        title: "Error",
                        description: "Please fill in all fields",
                        variant: "destructive"
                      });
                      return;
                    }
                    if (newPassword !== confirmPassword) {
                      toast({
                        title: "Error",
                        description: "New passwords do not match",
                        variant: "destructive"
                      });
                      return;
                    }
                    if (newPassword.length < 6) {
                      toast({
                        title: "Error",
                        description: "Password must be at least 6 characters",
                        variant: "destructive"
                      });
                      return;
                    }

                    const data = {
                      oldPassword: currentPassword,
                      newPassword,
                    }

                    const handleSavePassword = async () => {
                      try {
                        const response = await changePasswordApi({ oldPassword: currentPassword, newPassword });
                        console.log(response);
                        toast({
                          title: 'Password Updated',
                          description: 'Your password has been updated successfully.',
                        });
                      } catch (error) {
                        console.log(error);
                        toast({
                          title: 'Error',
                          description: error.response.data.message,
                          variant: 'destructive',
                        });
                      }
                    };

                    handleSavePassword();


                    setShowChangePassword(false);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;