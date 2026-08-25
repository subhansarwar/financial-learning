// app/(website)/page.tsx
import ExploreCoursesSection from '@/app/components/websiteComp/homeComp/ExploreCoursesSection';
import FaqSection from '@/app/components/websiteComp/homeComp/FaqSection';
import FeaturesSection from '@/app/components/websiteComp/homeComp/FeaturesSection';
import HowToBuySection from '@/app/components/websiteComp/homeComp/HowToBuySection';
import MoreCoursesSection from '@/app/components/websiteComp/homeComp/MoreCoursesSection';
import TestimonialsSection from '@/app/components/websiteComp/homeComp/TestimonialsSection';
import WhyUsSection from '@/app/components/websiteComp/homeComp/WhyUsSection';
import HeroSection from '../components/websiteComp/homeComp/HeroSection';

export default async function HomePage() {

  return (
    <>
      {/* ========== HERO SECTION ========== */}
      <HeroSection />

      {/* ========== EXPLORE OUR COURSES ========== */}
      <ExploreCoursesSection />

      {/* ========== FLAGSHIP PROGRAMS ========== */}
      <MoreCoursesSection />

      <HowToBuySection />

      <FeaturesSection />
      <WhyUsSection />
      <TestimonialsSection />
      <FaqSection />
    </>
  );
}