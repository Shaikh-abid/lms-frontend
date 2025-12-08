import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Image,
  FileText,
  ListVideo,
  Plus,
  Trash2,
  Upload,
  GripVertical,
  Play,
  Check,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { categories, levels, languages } from '@/data/courses';

interface Lecture {
  id: string;
  title: string;
  description: string;
  notes: string;
  videoUrl: string;
  duration: string;
  isFreePreview: boolean;
}

interface Section {
  id: string;
  title: string;
  lectures: Lecture[];
}

const AddCoursePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('landing');
  
  // Landing Page State
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');
  const [language, setLanguage] = useState('');
  const [duration, setDuration] = useState('');

  // Curriculum State
  const [sections, setSections] = useState<Section[]>([
    {
      id: '1',
      title: 'Introduction',
      lectures: [
        {
          id: 'l1',
          title: '',
          description: '',
          notes: '',
          videoUrl: '',
          duration: '',
          isFreePreview: false,
        },
      ],
    },
  ]);

  const hasFreePreview = sections.some((section) =>
    section.lectures.some((lecture) => lecture.isFreePreview && lecture.videoUrl)
  );

  const addSection = () => {
    setSections((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        title: `Section ${prev.length + 1}`,
        lectures: [
          {
            id: `l${Date.now()}`,
            title: '',
            description: '',
            notes: '',
            videoUrl: '',
            duration: '',
            isFreePreview: false,
          },
        ],
      },
    ]);
  };

  const removeSection = (sectionId: string) => {
    if (sections.length > 1) {
      setSections((prev) => prev.filter((s) => s.id !== sectionId));
    }
  };

  const updateSectionTitle = (sectionId: string, title: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, title } : s))
    );
  };

  const addLecture = (sectionId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              lectures: [
                ...s.lectures,
                {
                  id: `l${Date.now()}`,
                  title: '',
                  description: '',
                  notes: '',
                  videoUrl: '',
                  duration: '',
                  isFreePreview: false,
                },
              ],
            }
          : s
      )
    );
  };

  const removeLecture = (sectionId: string, lectureId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              lectures: s.lectures.filter((l) => l.id !== lectureId),
            }
          : s
      )
    );
  };

  const updateLecture = (
    sectionId: string,
    lectureId: string,
    field: keyof Lecture,
    value: string | boolean
  ) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              lectures: s.lectures.map((l) =>
                l.id === lectureId ? { ...l, [field]: value } : l
              ),
            }
          : s
      )
    );
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setBannerImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!title || !description || !price || !category || !level || !language) {
      toast.error('Please fill in all required fields in the Landing Page tab');
      setActiveTab('landing');
      return;
    }

    if (!hasFreePreview) {
      toast.error('Please mark at least one lecture with a video as Free Preview');
      setActiveTab('curriculum');
      return;
    }

    // Here you would submit to the backend
    toast.success('Course created successfully!');
    navigate('/instructor/dashboard');
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text">Create New Course</h1>
          <p className="text-muted-foreground mt-1">
            Fill in the details below to create your course
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="landing" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              <span className="hidden sm:inline">Landing Page</span>
              <span className="sm:hidden">Landing</span>
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Course Details</span>
              <span className="sm:hidden">Details</span>
            </TabsTrigger>
            <TabsTrigger value="curriculum" className="flex items-center gap-2">
              <ListVideo className="h-4 w-4" />
              <span>Curriculum</span>
            </TabsTrigger>
          </TabsList>

          {/* Landing Page Tab */}
          <TabsContent value="landing">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Banner Upload */}
              <Card className="glass border-border/50 lg:col-span-2">
                <CardHeader>
                  <CardTitle>Course Banner</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className={`relative border-2 border-dashed rounded-xl overflow-hidden transition-colors ${
                      bannerImage
                        ? 'border-primary/50'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {bannerImage ? (
                      <div className="relative aspect-video">
                        <img
                          src={bannerImage}
                          alt="Banner preview"
                          className="w-full h-full object-cover"
                        />
                        <Button
                          variant="secondary"
                          size="sm"
                          className="absolute top-4 right-4"
                          onClick={() => setBannerImage(null)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center aspect-video cursor-pointer hover:bg-muted/30 transition-colors">
                        <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                        <span className="text-muted-foreground">
                          Click to upload course banner
                        </span>
                        <span className="text-sm text-muted-foreground/70 mt-1">
                          Recommended: 1280x720 (16:9)
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleBannerUpload}
                        />
                      </label>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Basic Info */}
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Course Title *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Complete Web Development Bootcamp"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Input
                      id="subtitle"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      placeholder="A brief tagline for your course"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="What will students learn in this course?"
                      className="mt-1.5 min-h-[120px]"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Pricing & Category */}
              <Card className="glass border-border/50">
                <CardHeader>
                  <CardTitle>Pricing & Category</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price (₹) *</Label>
                      <Input
                        id="price"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="499"
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="originalPrice">Original Price (₹)</Label>
                      <Input
                        id="originalPrice"
                        type="number"
                        value={originalPrice}
                        onChange={(e) => setOriginalPrice(e.target.value)}
                        placeholder="2999"
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Category *</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.filter((c) => c !== 'All Categories').map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Level *</Label>
                      <Select value={level} onValueChange={setLevel}>
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          {levels.filter((l) => l !== 'All Levels').map((lvl) => (
                            <SelectItem key={lvl} value={lvl}>
                              {lvl}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Language *</Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.filter((l) => l !== 'All Languages').map((lang) => (
                            <SelectItem key={lang} value={lang}>
                              {lang}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="duration">Total Duration</Label>
                    <Input
                      id="duration"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="e.g., 48 hours"
                      className="mt-1.5"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Course Details Tab */}
          <TabsContent value="details">
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle>What Students Will Learn</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="• Build 16 web development projects&#10;• Learn HTML5, CSS3, JavaScript&#10;• Master React and Node.js"
                  className="min-h-[200px]"
                />
              </CardContent>
            </Card>

            <Card className="glass border-border/50 mt-6">
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="• No programming experience needed&#10;• A computer with internet access&#10;• Enthusiasm to learn"
                  className="min-h-[150px]"
                />
              </CardContent>
            </Card>

            <Card className="glass border-border/50 mt-6">
              <CardHeader>
                <CardTitle>Who This Course Is For</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="• Anyone who wants to learn web development&#10;• Students looking to start a career in tech&#10;• Developers wanting to expand their skills"
                  className="min-h-[150px]"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Curriculum Tab */}
          <TabsContent value="curriculum">
            <div className="space-y-6">
              {/* Free Preview Warning */}
              {!hasFreePreview && (
                <div className="flex items-center gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                  <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                  <p className="text-sm text-yellow-500">
                    You must mark at least one lecture with a video as "Free Preview" before publishing the course.
                  </p>
                </div>
              )}

              {hasFreePreview && (
                <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <p className="text-sm text-green-500">
                    Free preview requirement met! You can publish your course.
                  </p>
                </div>
              )}

              {/* Sections */}
              <Accordion type="multiple" className="space-y-4">
                {sections.map((section, sectionIndex) => (
                  <AccordionItem
                    key={section.id}
                    value={section.id}
                    className="glass border border-border/50 rounded-xl overflow-hidden"
                  >
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <div className="flex items-center gap-3 flex-1">
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                        <Input
                          value={section.title}
                          onChange={(e) => {
                            e.stopPropagation();
                            updateSectionTitle(section.id, e.target.value);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="max-w-md"
                          placeholder="Section Title"
                        />
                        <Badge variant="secondary">
                          {section.lectures.length} lecture{section.lectures.length !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <div className="space-y-4">
                        {section.lectures.map((lecture, lectureIndex) => (
                          <Card key={lecture.id} className="border border-border/30">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-4">
                                <div className="flex items-center gap-2 pt-2">
                                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                                  <Play className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="flex-1 space-y-4">
                                  <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                      <Label>Lecture Title</Label>
                                      <Input
                                        value={lecture.title}
                                        onChange={(e) =>
                                          updateLecture(
                                            section.id,
                                            lecture.id,
                                            'title',
                                            e.target.value
                                          )
                                        }
                                        placeholder="e.g., Introduction to HTML"
                                        className="mt-1.5"
                                      />
                                    </div>
                                    <div>
                                      <Label>Video URL</Label>
                                      <Input
                                        value={lecture.videoUrl}
                                        onChange={(e) =>
                                          updateLecture(
                                            section.id,
                                            lecture.id,
                                            'videoUrl',
                                            e.target.value
                                          )
                                        }
                                        placeholder="https://..."
                                        className="mt-1.5"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Description</Label>
                                    <Textarea
                                      value={lecture.description}
                                      onChange={(e) =>
                                        updateLecture(
                                          section.id,
                                          lecture.id,
                                          'description',
                                          e.target.value
                                        )
                                      }
                                      placeholder="Brief description of this lecture"
                                      className="mt-1.5 min-h-[80px]"
                                    />
                                  </div>
                                  <div>
                                    <Label>Notes (Optional)</Label>
                                    <Textarea
                                      value={lecture.notes}
                                      onChange={(e) =>
                                        updateLecture(
                                          section.id,
                                          lecture.id,
                                          'notes',
                                          e.target.value
                                        )
                                      }
                                      placeholder="Additional notes for students"
                                      className="mt-1.5 min-h-[60px]"
                                    />
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Switch
                                        id={`preview-${lecture.id}`}
                                        checked={lecture.isFreePreview}
                                        onCheckedChange={(checked) =>
                                          updateLecture(
                                            section.id,
                                            lecture.id,
                                            'isFreePreview',
                                            checked
                                          )
                                        }
                                      />
                                      <Label htmlFor={`preview-${lecture.id}`} className="cursor-pointer">
                                        Free Preview
                                      </Label>
                                      {lecture.isFreePreview && lecture.videoUrl && (
                                        <Badge className="ml-2 bg-green-500/20 text-green-500">
                                          ✓ Preview
                                        </Badge>
                                      )}
                                    </div>
                                    {section.lectures.length > 1 && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeLecture(section.id, lecture.id)}
                                        className="text-destructive hover:text-destructive"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addLecture(section.id)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Lecture
                          </Button>
                          {sections.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSection(section.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove Section
                            </Button>
                          )}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <Button variant="outline" onClick={addSection} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add New Section
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-4 mt-8 pt-8 border-t border-border/50">
          <Button variant="outline" onClick={() => navigate('/instructor/dashboard')}>
            Cancel
          </Button>
          <Button variant="gradient" onClick={handleSubmit}>
            Create Course
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default AddCoursePage;
