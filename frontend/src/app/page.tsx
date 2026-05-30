import { HeroSection } from "@/components/home/HeroSection";
import { RoomTypesSection } from "@/components/home/RoomTypesSection";
import { StylesSection } from "@/components/home/StylesSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { CTASection } from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <RoomTypesSection />
      <StylesSection />
      <GalleryPreview />
      <CTASection />
    </>
  );
}
