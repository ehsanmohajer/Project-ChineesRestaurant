import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { DailyDealsSection } from '@/components/home/DailyDealsSection';
import { MenuPreviewSection } from '@/components/home/MenuPreviewSection';
import { PopularItemsSection } from '@/components/home/PopularItemsSection';
import { ReviewsSection } from '@/components/home/ReviewsSection';
import { FeaturedItemsSection } from '@/components/home/FeaturedItemsSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturedItemsSection />
        <DailyDealsSection />
        <TestimonialsSection />
        <MenuPreviewSection />
        <PopularItemsSection />
        <ReviewsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
