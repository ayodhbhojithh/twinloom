import { SiteHeader } from "@/components/layout";
import { Container, Eyebrow } from "@/components/shared";

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        {/* Home sections land here one at a time, in the order set out in
            Docs/artifacts/TCT_Sitemap.md. */}
        <Container className="py-20">
          <Eyebrow tone="faint">Shell only</Eyebrow>
          <p className="mt-2 text-base text-body">
            Design tokens, system type and the global nav are in. Sections get
            added one by one.
          </p>
        </Container>
      </main>
    </>
  );
}
