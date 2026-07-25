import { SiteFooter, SiteHeader } from "@/components/layout";
import {
  AboutSection,
  CareSection,
  FaqSection,
  FeaturedWorkSection,
  FinalCtaSection,
  HeroSection,
  HowWeWorkSection,
  OutcomesSection,
  ProofSection,
} from "@/components/sections";

export default function Home() {
  return (
    <>
      <SiteHeader />

      {/* One scrollable page, in the block order set out in
          Docs/artifacts/TCT_Sitemap.md §1. Each section carries the id its nav
          link points at. */}
      <main className="flex-1">
        <HeroSection />
        <ProofSection />
        <OutcomesSection />
        <HowWeWorkSection />
        <FeaturedWorkSection />
        <AboutSection />
        <CareSection />
        <FaqSection />
        <FinalCtaSection />
      </main>

      <SiteFooter />
    </>
  );
}
