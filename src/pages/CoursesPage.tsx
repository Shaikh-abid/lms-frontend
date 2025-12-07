import { useState, useMemo } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import CourseCard from '@/components/courses/CourseCard';
import { mockCourses, categories, levels, languages } from '@/data/courses';
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
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

type SortOption = 'price-low' | 'price-high' | 'rating' | 'popular' | 'newest';

const CoursesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('popular');

  const filteredCourses = useMemo(() => {
    let filtered = [...mockCourses];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          course.instructor.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((course) =>
        selectedCategories.includes(course.category)
      );
    }

    // Level filter
    if (selectedLevels.length > 0) {
      filtered = filtered.filter((course) =>
        selectedLevels.includes(course.level)
      );
    }

    // Language filter
    if (selectedLanguages.length > 0) {
      filtered = filtered.filter((course) =>
        selectedLanguages.includes(course.language)
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
        filtered.sort((a, b) => b.studentsCount - a.studentsCount);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategories, selectedLevels, selectedLanguages, sortBy]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    }
  };

  const handleLevelChange = (level: string, checked: boolean) => {
    if (checked) {
      setSelectedLevels([...selectedLevels, level]);
    } else {
      setSelectedLevels(selectedLevels.filter((l) => l !== level));
    }
  };

  const handleLanguageChange = (language: string, checked: boolean) => {
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

  const FilterSidebar = () => (
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
                      handleCategoryChange(category, checked as boolean)
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
                      handleLevelChange(level, checked as boolean)
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
                      handleLanguageChange(language, checked as boolean)
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

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">
            Explore Our <span className="gradient-text">Courses</span>
          </h1>
          <p className="text-muted-foreground">
            Discover {mockCourses.length}+ courses to help you grow your skills
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
              <FilterSidebar />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort & Mobile Filter */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <p className="text-muted-foreground">
                Showing <span className="font-medium text-foreground">{filteredCourses.length}</span> courses
              </p>
              
              <div className="flex items-center gap-4">
                {/* Mobile Filter Button */}
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
                      <FilterSidebar />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Sort Dropdown */}
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Course Grid */}
            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCourses.map((course, index) => (
                  <div
                    key={course.id}
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
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CoursesPage;
