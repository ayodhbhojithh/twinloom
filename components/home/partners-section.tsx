import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { ServiceWall } from "@/components/pages/services-view";
import { ROUTES } from "@/lib/site";

/**
 * Our partners, on the landing page.
 *
 * The fourth screen. The first three say what we do, let you try it and show
 * how we think; this answers the question that follows all of them - who is
 * actually going to do the work.
 *
 * It borrows the wall from the services page rather than restating it. Two
 * copies of the list would disagree the first week one of them changed, and the
 * wall is the part of that page worth seeing from here.
 */
export function PartnersSection() {
  return (
    <section className="page-frame pt-14 pb-14 sm:pt-20 sm:pb-20 lg:pt-32 lg:pb-28">
      {/* Down the middle, and the wall crosses underneath it. That is the
          whole reason a centred heading works here: a column of centred text
          has no second reading direction on its own, and something drifting
          across beneath gives the eye somewhere to go. */}
      <div className="flex flex-col items-center text-center">
        <h2 className="reveal section-head max-w-[26ch] text-ink">
          Our Services
        </h2>

        <Link
          href={ROUTES.services}
          className="group/all reveal mt-6 inline-flex items-center gap-2 rounded-pill bg-field px-4.5 py-2 text-[13.5px] font-semibold text-ink transition-colors [--step:1] hover:bg-hair"
        >
          What we offer
          <ArrowUpRight
            aria-hidden
            className="size-4 transition-transform group-hover/all:translate-x-0.5 group-hover/all:-translate-y-0.5"
          />
        </Link>
      </div>

      {/* The wall is the one thing here that already moves. It arrives on the
          scroll like everything else and then keeps drifting on its own, which
          is why the reveal is on a wrapper rather than on the wall: two
          animations on one element would be one `transform` written twice, and
          the second would win. */}
      <div className="reveal mt-10 [--step:2] lg:mt-12">
        <ServiceWall bleed />
      </div>

      <p className="reveal mx-auto mt-6 max-w-[92ch] text-center text-[14px] leading-[1.6] text-quiet [--step:3]">
        One contract, one invoice, and named in the proposal before the work
        starts. Most projects need none of them - a specialist is added because
        the work justifies one.
      </p>
    </section>
  );
}
