import { SiteHeader } from "@/components/layout";
import { Container, Eyebrow } from "@/components/shared";

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main id="top" className="flex-1">
        {/* One scrollable page. Sections land here in the order set out in
            Docs/artifacts/TCT_Sitemap.md, each with the id its nav link
            points at. */}
        <Container className="py-20">
          <Eyebrow tone="faint">Shell only</Eyebrow>
          <p className="mt-2 text-base text-body">
            Design tokens, type and the global nav are in. Sections get added one
            by one.
          </p>
        </Container>
      </main>
    </>
  );
}
