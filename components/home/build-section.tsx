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
    <section className="page-frame border-t border-hair py-20 lg:py-24">
      {/* The head is centred and the tool under it is not. What is being said
          here is one address to the room, and it can sit in the middle of the
          page; what follows is work, and work has a left edge to read down. */}
      <div className="max-w-wide">
        <p className="text-center font-mono text-[12px] font-bold tracking-[0.18em] text-idx uppercase">
          Build your website
        </p>

        <h2 className="mx-auto mt-4 max-w-[980px] text-center text-[30px] leading-[1.12] font-extrabold tracking-[-0.028em] text-ink sm:text-[38px]">
          Build your website
        </h2>

        <p className="mx-auto mt-4 mb-8 max-w-measure text-center text-[17.5px] leading-[1.6] text-ink sm:text-[19px]">
          Read what this does, work through the areas, or just send us what you
          have.
        </p>

        <BuildTool idPrefix="home-build" centred />
      </div>
    </section>
  );
}
