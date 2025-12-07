import MainLayout from '@/components/layout/MainLayout';
import { GraduationCap, Target, Heart, Zap } from 'lucide-react';

const AboutPage = () => {
  const team = [
    { name: 'Sarah Johnson', role: 'CEO & Founder', avatar: 'SJ' },
    { name: 'Michael Chen', role: 'CTO', avatar: 'MC' },
    { name: 'Emily Davis', role: 'Head of Education', avatar: 'ED' },
    { name: 'James Wilson', role: 'Lead Designer', avatar: 'JW' },
  ];

  const values = [
    {
      icon: Target,
      title: 'Quality First',
      description: 'We curate only the best courses from industry experts.',
    },
    {
      icon: Heart,
      title: 'Student-Centered',
      description: 'Every decision is guided by what is best for learners.',
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We continuously improve with the latest technology.',
    },
  ];

  return (
    <MainLayout>
      <section className="gradient-hero py-20">
        <div className="container mx-auto px-4 text-center text-primary-foreground">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/20 mx-auto">
              <GraduationCap className="h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">About LMS System</h1>
            <p className="text-xl text-primary-foreground/80">
              Empowering millions of learners worldwide with quality education since 2020.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Our <span className="gradient-text">Mission</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                At LMS System, we believe quality education should be accessible to everyone. Our mission is to transform lives through learning.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { value: '500K+', label: 'Active Students' },
                { value: '1000+', label: 'Quality Courses' },
                { value: '150+', label: 'Expert Instructors' },
                { value: '50+', label: 'Countries' },
              ].map((stat) => (
                <div key={stat.label} className="bg-card rounded-2xl border border-border p-6 text-center space-y-2">
                  <div className="text-4xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our <span className="gradient-text">Values</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value) => (
              <div key={value.title} className="text-center space-y-4">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow mx-auto">
                  <value.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our <span className="gradient-text">Team</span></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div key={member.name} className="bg-card rounded-2xl border border-border p-6 text-center space-y-4 hover-lift">
                <div className="h-16 w-16 mx-auto rounded-full gradient-primary flex items-center justify-center text-xl font-bold text-primary-foreground">
                  {member.avatar}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default AboutPage;
