import { useState, useMemo, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import CourseCard from '@/components/courses/CourseCard';
import { categories, levels, languages } from '@/data/courses';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Loader2, Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useAuthStore } from '@/store/authStore';
import { getAllCoursesForInstructorApi } from '@/backend-apis/instructure-apis/instructure.api';
import { getAllCourseStudentViewApi } from '@/backend-apis/student-apis/student.api';

// --- FILTER SIDEBAR ---
const FilterSidebar = ({
  searchQuery,
  setSearchQuery,
  selectedCategories,
  handleCategoryChange,
  selectedLevels,
  handleLevelChange,
  selectedLanguages,
  handleLanguageChange,
  clearFilters,
  hasActiveFilters
}) => (
  <div className="space-y-6">
    {/* Search */}
    <div className="space-y-2">
      <Label>Search Courses</Label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>

    {/* Clear Filters */}
    {hasActiveFilters && (
      <Button
        variant="outline"
        size="sm"
        onClick={clearFilters}
        className="w-full gap-2"
      >
        <X className="h-4 w-4" />
        Clear All Filters
      </Button>
    )}

    <Accordion type="multiple" defaultValue={['category', 'level', 'language']} className="w-full">
      {/* Category Filter */}
      <AccordionItem value="category">
        <AccordionTrigger className="text-sm font-semibold">
          Category
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            {categories.slice(1).map((category) => (
              <div key={category} className="flex items-center gap-2">
                <Checkbox
                  id={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={(checked) =>
                    handleCategoryChange(category, checked)
                  }
                />
                <Label htmlFor={category} className="text-sm font-normal cursor-pointer">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Level Filter */}
      <AccordionItem value="level">
        <AccordionTrigger className="text-sm font-semibold">
          Level
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            {levels.slice(1).map((level) => (
              <div key={level} className="flex items-center gap-2">
                <Checkbox
                  id={level}
                  checked={selectedLevels.includes(level)}
                  onCheckedChange={(checked) =>
                    handleLevelChange(level, checked)
                  }
                />
                <Label htmlFor={level} className="text-sm font-normal cursor-pointer">
                  {level}
                </Label>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Language Filter */}
      <AccordionItem value="language">
        <AccordionTrigger className="text-sm font-semibold">
          Language
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            {languages.slice(1).map((language) => (
              <div key={language} className="flex items-center gap-2">
                <Checkbox
                  id={language}
                  checked={selectedLanguages.includes(language)}
                  onCheckedChange={(checked) =>
                    handleLanguageChange(language, checked)
                  }
                />
                <Label htmlFor={language} className="text-sm font-normal cursor-pointer">
                  {language}
                </Label>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
);

// --- MAIN COMPONENT ---
const CoursesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [sortBy, setSortBy] = useState('newest');

  // State for data
  const [instructorViewCourses, setInstructorViewCourses] = useState([]);
  const [studentViewCourses, setStudentViewCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let response;
        const filters = {
          searchQuery,
          selectedCategories,
          selectedLevels,
          selectedLanguages,
          sortBy,
        };

        // --- UPDATED LOGIC START ---
        // If user is explicitly an instructor, fetch instructor courses
        if (user?.role === "instructor") {
          response = await getAllCoursesForInstructorApi(filters);

          if (response?.success) {
            setInstructorViewCourses(response.courses || []);
          } else {
            setInstructorViewCourses([]);
          }
        }
        // For Students AND Guests (null user), fetch student view courses
        else {
          response = await getAllCourseStudentViewApi(filters);

          if (response?.success) {
            setStudentViewCourses(response.data || []);
          } else {
            setStudentViewCourses([]);
          }
        }
        // --- UPDATED LOGIC END ---

      } catch (error) {
        console.error("Failed to fetch courses", error);
        // Reset both states on error for safety
        setInstructorViewCourses([]);
        setStudentViewCourses([]);
      } finally {
        setIsLoading(false);
      }
    };

    // We removed the `if (user)` check here.
    // Now it runs immediately for everyone (including guests).
    const timer = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(timer);
  }, [user, searchQuery, selectedCategories, selectedLevels, selectedLanguages, sortBy]);

  const handleCategoryChange = (category, checked) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    }
  };

  const handleLevelChange = (level, checked) => {
    if (checked) {
      setSelectedLevels([...selectedLevels, level]);
    } else {
      setSelectedLevels(selectedLevels.filter((l) => l !== level));
    }
  };

  const handleLanguageChange = (language, checked) => {
    if (checked) {
      setSelectedLanguages([...selectedLanguages, language]);
    } else {
      setSelectedLanguages(selectedLanguages.filter((l) => l !== language));
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedLevels([]);
    setSelectedLanguages([]);
    setSearchQuery('');
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedLevels.length > 0 ||
    selectedLanguages.length > 0 ||
    searchQuery;

  // Logic to determine which courses to display
  // If user is null, user?.role is undefined, so it defaults to studentViewCourses (Correct for guests)
  const coursesToShow = user?.role === "instructor" ? instructorViewCourses : studentViewCourses;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">
            Explore Our <span className="gradient-text">Courses</span>
          </h1>
          <p className="text-muted-foreground">
            Discover {coursesToShow.length}+ courses to help you grow your skills
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 bg-card rounded-2xl border border-border p-6">
              <h2 className="font-semibold text-lg mb-6 flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5" />
                Filters
              </h2>
              <FilterSidebar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategories={selectedCategories}
                handleCategoryChange={handleCategoryChange}
                selectedLevels={selectedLevels}
                handleLevelChange={handleLevelChange}
                selectedLanguages={selectedLanguages}
                handleLanguageChange={handleLanguageChange}
                clearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between gap-4 mb-6">
              <p className="text-muted-foreground">
                Showing <span className="font-medium text-foreground">{coursesToShow.length}</span> courses
              </p>

              <div className="flex items-center gap-4">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden gap-2">
                      <SlidersHorizontal className="h-4 w-4" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterSidebar
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        selectedCategories={selectedCategories}
                        handleCategoryChange={handleCategoryChange}
                        selectedLevels={selectedLevels}
                        handleLevelChange={handleLevelChange}
                        selectedLanguages={selectedLanguages}
                        handleLanguageChange={handleLanguageChange}
                        clearFilters={clearFilters}
                        hasActiveFilters={hasActiveFilters}
                      />
                    </div>
                  </SheetContent>
                </Sheet>

                <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Course Grid */}
            {
              isLoading ? (
                <div className="flex justify-center items-center h-[300px]">
                  <Loader2 className="animate-spin" />
                </div>
              ) : (
                coursesToShow.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {coursesToShow.map((course, index) => (
                      <div
                        key={course._id}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <CourseCard course={course} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <p className="text-muted-foreground text-lg">No courses found matching your criteria.</p>
                    <Button variant="outline" className="mt-4" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  </div>
                )
              )
            }

          </div>
        </div>
      </div>  
    </MainLayout>
  );
};

export default CoursesPage;