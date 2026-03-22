import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ServicesOverview from '@/components/ServicesOverview';
import EventHighlight from '@/components/EventHighlight';
import Testimonials from '@/components/Testimonials';
import CommitteeSection from '@/components/CommitteeSection';
import type { CommitteeMember, Testimonial } from '@/hooks/useSiteSettings';

interface IndexProps {
  t: (key: string) => string;
  committeeMembers?: CommitteeMember[];
  testimonials?: Testimonial[];
}

const Index = ({ t, committeeMembers, testimonials }: IndexProps) => {
  return (
    <main className="pt-16">
      <HeroSection t={t} />
      <AboutSection t={t} />
      <ServicesOverview t={t} />
      <EventHighlight t={t} />
      <Testimonials t={t} testimonials={testimonials} />
      <CommitteeSection t={t} members={committeeMembers} />
    </main>
  );
};

export default Index;
