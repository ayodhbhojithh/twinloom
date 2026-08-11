import { ServiceWall } from "@/components/pages/services-view";

/**
 * Our services, on the landing page - and the whole of the section now
 * rather than a teaser for one.
 *
 * It used to link out to `/services` for the rest of the story: a rules
 * panel, a longer standfirst, the same wall repeated. That page was one click
 * further into what this section had already shown, so the click has come
 * off and `id="services"` has gone on instead - the header's `Services` link
 * and every other page's own points at this section directly now, the same
 * way the hero's arrow points into `BuildSection` below.
 *
 * It still borrows the wall from `services-view.tsx` rather than restating
 * it. Two copies of the list would disagree the first week one of them
 * changed, and the wall is the part of that page worth keeping.
 */
export function PartnersSection() {
  return (
    <section
      id="services"
      className="page-frame scroll-mt-[var(--nav-height)] pt-14 pb-14 max-sm:pt-9 max-sm:pb-9 sm:pt-20 sm:pb-20 lg:pt-32 lg:pb-28"
    >
      {/* Down the middle, and the wall crosses underneath it. That is the
          whole reason a centred heading works here: a column of centred text
          has no second reading direction on its own, and something drifting
          across beneath gives the eye somewhere to go. */}
      <div className="flex flex-col items-center text-center">
        <h2 className="reveal section-head max-w-[26ch] text-ink">
          Our Services
        </h2>
      </div>

      {/* The wall is the one thing here that already moves. It arrives on the
          scroll like everything else and then keeps drifting on its own, which
          is why the reveal is on a wrapper rather than on the wall: two
          animations on one element would be one `transform` written twice, and
          the second would win. */}
      <div className="reveal mt-10 [--step:1] max-sm:mt-6 lg:mt-12">
        <ServiceWall bleed />
      </div>

      {/* No line under the wall.

          "One contract, one invoice, and named in the proposal before the work
          starts. Most projects need none of them - a specialist is added because
          the work justifies one." was written when this section was a wall of
          partner disciplines, and it was answering the question that raises:
          who are these other people and what will they cost me. There are no
          partners on it now - it is the six things we do, each with its own
          sentence - so the reassurance was answering a question the section had
          stopped asking, and "most projects need none of them" read as six
          services being talked out of. */}
    </section>
  );
}
