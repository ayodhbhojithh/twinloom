import { SiteHeader } from "@/components/layout";
import { Container, MonoLabel } from "@/components/shared";

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main id="top" className="flex-1">
        {/* Sections land here one at a time. Nothing below the navbar yet. */}
        <Container className="py-20">
          <MonoLabel>Shell only</MonoLabel>
          <p className="mt-2 text-[15px] text-ink-3">
            Layout, tokens and navbar are in. Sections get added one by one.
          </p>
        </Container>
      </main>
    </>
  );
}
