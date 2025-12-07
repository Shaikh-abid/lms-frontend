import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sun, Moon, Monitor, Camera, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const { user, updateUser, isAuthenticated } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  if (!isAuthenticated) {
    navigate('/signin');
    return null;
  }

  const handleSaveProfile = () => {
    updateUser({ name, email });
    toast({
      title: 'Profile Updated',
      description: 'Your profile has been updated successfully.',
    });
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
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="text-2xl gradient-primary text-primary-foreground">
                    {user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground shadow-lg hover:opacity-90 transition-opacity">
                  <Camera className="h-4 w-4" />
                </button>
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
                <Button variant="outline">Change</Button>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security
                  </p>
                </div>
                <Button variant="outline">Enable</Button>
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
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
