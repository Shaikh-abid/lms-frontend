import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import CartPage from "./pages/CartPage";
import MyCoursesPage from "./pages/MyCoursesPage";
import CourseProgressPage from "./pages/CourseProgressPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import AboutPage from "./pages/AboutPage";
import SettingsPage from "./pages/SettingsPage";
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import AddCoursePage from "./pages/instructor/AddCoursePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/course/:id" element={<CourseDetailPage />} />
          <Route path="/course/:id/learn" element={<CourseProgressPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/my-courses" element={<MyCoursesPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
          <Route path="/instructor/courses/new" element={<AddCoursePage />} />
          <Route path="/instructor/courses/:id/edit" element={<AddCoursePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
