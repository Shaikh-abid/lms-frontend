import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  X,
  AlertCircle,
  FileWarning,
} from 'lucide-react';
import { toast } from 'sonner';
import { categories, levels, languages } from '@/data/courses';
import {
  createCourseApi, addSectionsApi, addLecturesApi, getCourseByIdApi,
  updateCourseApi,
  updateCourseLectureApi
} from '@/backend-apis/courses-apis/courseCreation.apis';


interface Lecture {
  id: string;
  title: string;
  description: string;
  notes: string;
  videoUrl: string;
  duration: string;
  isFreePreview: boolean;
  videoFile?: File | null;
  videoPreviewUrl?: string;
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
  const [whatYouWillLearn, setWhatYouWillLearn] = useState<string>('');
  const [requirements, setRequirements] = useState<string>('');
  const [courseFor, setCourseFor] = useState<string>('');

  const [isLoading, setIsLoading] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchCourseData = async () => {
        try {
          const data = await getCourseByIdApi(id);

          // Populate Basic Info
          setTitle(data.courseTitle);
          setSubtitle(data.subtitle || '');
          setDescription(data.description);
          setPrice(data.price);
          setOriginalPrice(data.originalPrice);
          setCategory(data.category);
          setLevel(data.level);
          setLanguage(data.language);
          setDuration(data.duration);
          setWhatYouWillLearn(data.courseOverview);
          setRequirements(data.coursePrerequisites);
          setCourseFor(data.courseFor);
          setBannerImage(data.thumbnail);

          // Populate Curriculum
          const mappedSections = data.courseContent.map((sec: any) => ({
            id: sec._id,
            title: sec.sectionTitle,
            lectures: sec.lectures.map((lec: any) => ({
              id: lec._id,
              title: lec.title,
              description: lec.videoDescription || '',
              notes: lec.notes || '',
              videoUrl: lec.videoUrl,
              duration: lec.duration || '',
              isFreePreview: lec.freePreview,
              videoFile: null,
              videoPreviewUrl: lec.videoUrl
            }))
          }));

          setSections(mappedSections);

        } catch (error) {
          console.error("Failed to fetch course", error);
          toast.error("Failed to load course details");
        }
      };

      fetchCourseData();
    }
  }, [id]);

  // Curriculum State
  const [sections, setSections] = useState<Section[]>([
    {
      id: Date.now().toString(), // Using timestamp ID for new sections
      title: 'Introduction',
      lectures: [
        {
          id: `l${Date.now()}`, // Using timestamp ID for new lectures
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
    section.lectures.some(
      (lecture) =>
        lecture.isFreePreview &&
        (lecture.videoFile || lecture.videoUrl)
    )
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
                videoFile: null,
                videoPreviewUrl: '',
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
    value: string | boolean | File | null
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
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setBannerImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!title || !description || !price || !category || !level || !language) {
      toast.error('Please fill in all required fields in the Landing Page tab');
      setActiveTab('landing');
      return;
    }

    if (!thumbnailFile) {
      toast.error('Please upload a Course Banner image');
      setActiveTab('landing');
      return;
    }

    if (!hasFreePreview) {
      toast.error('Please mark at least one lecture with a video as Free Preview');
      setActiveTab('curriculum');
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading('Initializing course creation...', { duration: Infinity });

    try {
      // 1. Create Course
      const courseFormData = new FormData();
      courseFormData.append('courseTitle', title);
      courseFormData.append('subtitle', subtitle);
      courseFormData.append('description', description);
      courseFormData.append('price', price);
      courseFormData.append('originalPrice', originalPrice);
      courseFormData.append('category', category);
      courseFormData.append('level', level);
      courseFormData.append('language', language);
      courseFormData.append('duration', duration);
      courseFormData.append('courseOverview', whatYouWillLearn);
      courseFormData.append('coursePrerequisites', requirements);
      courseFormData.append('courseFor', courseFor);
      if (thumbnailFile) courseFormData.append('thumbnail', thumbnailFile);

      toast.loading('Step 1/3: Creating Course...', { id: toastId });
      const courseRes = await createCourseApi(courseFormData);
      const courseId = courseRes._id;

      // 2. Sections & Lectures
      toast.loading('Step 2/3: Uploading Curriculum...', { id: toastId });

      for (const section of sections) {
        const sectionRes = await addSectionsApi(
          { sectionTitle: section.title },
          courseId
        );
        const createdSection = sectionRes.courseContent[sectionRes.courseContent.length - 1];
        const sectionId = createdSection._id;

        for (const lecture of section.lectures) {
          if (!lecture.title || !lecture.videoFile) continue;

          toast.loading(`Uploading: ${lecture.title}...`, { id: toastId });

          const lectureFormData = new FormData();
          lectureFormData.append('title', lecture.title);
          lectureFormData.append('videoDescription', lecture.description);
          lectureFormData.append('notes', lecture.notes);
          lectureFormData.append('isFreePreview', String(lecture.isFreePreview));
          lectureFormData.append('video', lecture.videoFile);

          await addLecturesApi(lectureFormData, courseId, sectionId);
        }
      }

      toast.success('Course published successfully!', { id: toastId });
      navigate('/instructor/dashboard');

    } catch (error: any) {
      console.error(error);
      const errorMsg = error.response?.data?.message || 'Something went wrong';
      toast.error(`Error: ${errorMsg}`, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  // --- THIS IS THE UPDATED FUNCTION ---
  const handleUpdate = async () => {
    if (!title || !description || !price) {
      toast.error('Please fill in required fields');
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading('Updating course...', { duration: Infinity });

    try {
      // 1. Update Basic Course Info
      const courseData: any = {
        courseTitle: title,
        subtitle,
        description,
        price,
        originalPrice,
        category,
        level,
        language,
        duration,
        courseOverview: whatYouWillLearn,
        coursePrerequisites: requirements,
        courseFor,
      };

      const formData = new FormData();
      Object.keys(courseData).forEach(key => formData.append(key, courseData[key]));
      if (thumbnailFile) formData.append('thumbnail', thumbnailFile);

      await updateCourseApi(formData, id!);

      // 2. Handle Curriculum Updates (Add New or Edit Existing)
      let lectureCount = 0;

      for (const section of sections) {
        let currentSectionId = section.id;

        // CHECK: Is this a NEW section? (ID is a timestamp, usually < 20 chars)
        // MongoDB IDs are 24 chars.
        if (section.id.length < 20) {
          toast.loading(`Creating New Section: ${section.title}`, { id: toastId });
          const sectionRes = await addSectionsApi({ sectionTitle: section.title }, id!);
          // The new section is the last one in the returned courseContent array
          const newSection = sectionRes.courseContent[sectionRes.courseContent.length - 1];
          currentSectionId = newSection._id;
        }

        // Loop through Lectures
        for (const lecture of section.lectures) {
          lectureCount++;

          const lectureFormData = new FormData();
          lectureFormData.append('title', lecture.title);
          lectureFormData.append('videoDescription', lecture.description);
          lectureFormData.append('notes', lecture.notes);
          lectureFormData.append('isFreePreview', String(lecture.isFreePreview));

          // CHECK: Is this a NEW lecture?
          if (lecture.id.length < 20) {
            // New Lecture: Needs a video file to be valid
            if (!lecture.videoFile) {
              console.warn(`Skipping new lecture "${lecture.title}" because no video file was selected.`);
              continue;
            }

            toast.loading(`Uploading New Lecture: ${lecture.title}...`, { id: toastId });
            lectureFormData.append('video', lecture.videoFile);

            // Call Create API
            await addLecturesApi(lectureFormData, id!, currentSectionId);

          } else {
            // Existing Lecture: Update it
            toast.loading(`Updating Lecture: ${lecture.title}...`, { id: toastId });

            // Only append video if a new one is selected
            if (lecture.videoFile) {
              lectureFormData.append('video', lecture.videoFile);
            }

            // Call Update API
            await updateCourseLectureApi(lectureFormData, id!, currentSectionId, lecture.id);
          }
        }
      }

      toast.success('Course updated successfully!', { id: toastId });
      navigate('/instructor/dashboard');

    } catch (error) {
      console.error(error);
      toast.error("Failed to update course", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text">
            {id ? 'Edit Course' : 'Create New Course'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {id ? 'Update your course content details' : 'Fill in the details below to create your course'}
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

          <TabsContent value="landing">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="glass border-border/50 lg:col-span-2">
                <CardHeader>
                  <CardTitle>Course Banner</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className={`relative border-2 border-dashed rounded-xl overflow-hidden transition-colors ${bannerImage
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

          <TabsContent value="details">
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle>What Students Will Learn</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={whatYouWillLearn}
                  onChange={(e) => setWhatYouWillLearn(e.target.value)}
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
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
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
                  value={courseFor}
                  onChange={(e) => setCourseFor(e.target.value)}
                  placeholder="• Anyone who wants to learn web development&#10;• Students looking to start a career in tech&#10;• Developers wanting to expand their skills"
                  className="min-h-[150px]"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="curriculum">
            <div className="space-y-6">
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <FileWarning className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-500">
                  The Videos which you upload should not be more than 500 MB in size.
                </p>
              </div>
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
                                            "title",
                                            e.target.value
                                          )
                                        }
                                        placeholder="e.g., Introduction to HTML"
                                        className="mt-1.5"
                                      />
                                    </div>

                                    <div>
                                      <Label>Upload Video</Label>
                                      <Input
                                        type="file"
                                        accept="video/*"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                            const previewUrl = URL.createObjectURL(file);
                                            updateLecture(
                                              section.id,
                                              lecture.id,
                                              "videoFile",
                                              file
                                            );
                                            updateLecture(
                                              section.id,
                                              lecture.id,
                                              "videoPreviewUrl",
                                              previewUrl
                                            );
                                          }
                                        }}
                                        className="mt-1.5"
                                      />

                                      {lecture.videoPreviewUrl && (
                                        <div className="mt-3 relative rounded-md overflow-hidden bg-slate-900 aspect-video">
                                          <video
                                            src={lecture.videoPreviewUrl}
                                            controls
                                            className="w-full h-full object-contain"
                                          />
                                          <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 h-6 w-6 rounded-full opacity-80 hover:opacity-100"
                                            onClick={() => {
                                              updateLecture(section.id, lecture.id, "videoFile", null);
                                              updateLecture(section.id, lecture.id, "videoPreviewUrl", "");
                                            }}
                                          >
                                            <X className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      )}
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
                                          "description",
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
                                          "notes",
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
                                            "isFreePreview",
                                            checked
                                          )
                                        }
                                      />
                                      <Label
                                        htmlFor={`preview-${lecture.id}`}
                                        className="cursor-pointer"
                                      >
                                        Free Preview
                                      </Label>
                                      {lecture.isFreePreview && lecture.videoPreviewUrl && (
                                        <Badge className="ml-2 bg-green-500/20 text-green-500">
                                          ✓ Ready
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

        <div className="flex items-center justify-end gap-4 mt-8 pt-8 border-t border-border/50">
          <Button variant="outline" onClick={() => navigate('/instructor/dashboard')}>
            Cancel
          </Button>
          <Button
            variant="gradient"
            disabled={isLoading}
            onClick={id ? handleUpdate : handleSubmit}
          >
            {isLoading
              ? (id ? 'Updating...' : 'Creating...')
              : (id ? 'Update Course' : 'Create Course')
            }
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default AddCoursePage;