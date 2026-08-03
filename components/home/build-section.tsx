import { BuildTool } from "@/components/build/build-tool";

/**
 * The build screen, on the landing page.
 *
 * The same component the build page renders, so it is that screen rather than a
 * second version of it: every tab, every band, the panel down the right, the
 * framework note, all of it. Two implementations of one screen say different
 * things by the second edit, and this one has to stay in step because both write
 * to the same answers.
 *
 * Only the heading is written here. The build page's is the document's `h1` and
 * this page already has one, so the same words are set as an `h2` instead.
 */
export function BuildSection() {
  return (
    <section className="page-frame py-20 lg:py-24">
      {/* The head is centred and the tool under it is not. What is being said
          here is one address to the room, and it can sit in the middle of the
          page; what follows is work, and work has a left edge to read down. */}
      {/* `mx-auto`, or the section sits against the left gutter on any screen
          wider than the container and the whole thing reads as off-centre no
          matter how the type inside it is aligned. */}
      <div className="mx-auto max-w-wide">
        {/* Clamped rather than stepped, so it scales with the page the way the
            hero above it does instead of jumping once at one breakpoint. It
            stops just under the hero: this is the second thing on the page and
            should not out-shout the first. */}
        <h2 className="mx-auto max-w-[1400px] text-center text-[clamp(30px,3vw,48px)] leading-[1.08] font-extrabold tracking-[-0.032em] text-ink">
          Build your website
        </h2>

        <p className="mx-auto mt-4 mb-8 max-w-[1400px] text-center text-[17.5px] leading-[1.6] text-ink sm:text-[19px]">
          Read what this does, work through the areas, or just send us what you
          have.
        </p>

        <BuildTool idPrefix="home-build" centred />
      </div>
    </section>
  );
}
