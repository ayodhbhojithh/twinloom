import { SiteFooter, SiteHeader } from "@/components/layout";
import {
  CtaSection,
  EstimatorSection,
  FaqSection,
  HeroSection,
  PackagesSection,
  ProcessSection,
  ServicesSection,
} from "@/components/sections";

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <HeroSection />
        <ServicesSection />
        <EstimatorSection />
        <ProcessSection />
        <PackagesSection />
        <FaqSection />
        <CtaSection />
      </main>

      <SiteFooter />
    </>
  );
}
