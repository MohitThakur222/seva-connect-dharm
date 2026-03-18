import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ServicesOverview from '@/components/ServicesOverview';
import EventHighlight from '@/components/EventHighlight';
import Testimonials from '@/components/Testimonials';
import CommitteeSection from '@/components/CommitteeSection';

interface IndexProps {
  t: (key: string) => string;
}

const Index = ({ t }: IndexProps) => {
  return (
    <main className="pt-16">
      <HeroSection t={t} />
      <AboutSection t={t} />
      <ServicesOverview t={t} />
      <EventHighlight t={t} />
      <Testimonials t={t} />
      <CommitteeSection t={t} />
    </main>
  );
};

export default Index;
