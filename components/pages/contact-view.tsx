import { ArrowUpRight, CalendarClock, PencilLine } from "lucide-react";
import Link from "next/link";

import { EmptyMark } from "@/components/blocks/build-note";
import { PageShell } from "@/components/layout";
import { CutPanel } from "@/components/layout/cut-panel";
import { ROUTES } from "@/lib/site";

/* ---------------------------------------------------------------------------
   Contact us.

   Two ways in that actually exist, on cut surfaces of their own, and an honest
   account of the ones that do not yet.

   Nothing here is invented, and that is the whole difficulty of the page: a
   contact screen wants a phone number, an address and an inbox, and this
   company has none of them written down anywhere. A plausible-looking number is
   worse than a gap - somebody rings it. So the two routes that are real are
   given the whole page, and what is missing is named as missing.
--------------------------------------------------------------------------- */

/** The ways in that exist today. */
const WAYS = [
  {
    href: ROUTES.build,
    icon: PencilLine,
    kicker: "Best first move",
    n: "Tell us what the site is for",
    sub: "Eleven questions, all of them optional, and a written scope back within two working days. It costs nothing and commits you to nothing.",
    go: "Start the run-through",
    tone: "ink" as const,
  },
  {
    href: ROUTES.book,
    icon: CalendarClock,
    kicker: "If you would rather talk",
    n: "Book a time",
    sub: "Pick a length and a slot. Come with the run-through done or come with nothing - both are a conversation we can have.",
    go: "Book a meeting",
    tone: "quiet" as const,
  },
];

export function ContactView() {
  return (
    <PageShell>
      <CutPanel
        className="w-full"
        /* The picture is the right half of the head, cut to the surface's own
           outline. Without one the panel is a paragraph with a field of empty
           white beside it - the shape is drawn for a picture and reads as
           missing one. */
        image="/partners/hero-marble.png"
        corner={
          <Link
            href={ROUTES.build}
            aria-label="Build your website"
            title="Build your website"
            className="flex size-11 items-center justify-center rounded-pill bg-ink text-white transition-opacity hover:opacity-85"
          >
            <ArrowUpRight className="size-[18px]" strokeWidth={2.2} />
          </Link>
        }
      >
        <div className="max-w-[52ch]">
          <p className="font-mono text-[9px] font-bold tracking-[0.16em] text-mark uppercase">
            Contact us
          </p>

          <h1 className="mt-3 max-w-[min(20ch,var(--notch-free,62ch))] text-[clamp(26px,2.9vw,42px)] leading-[1.05] font-extrabold tracking-[-0.04em] text-ink">
            Two ways in, and neither is a form.
          </h1>

          <p className="mt-4 text-[clamp(15px,1.2vw,17px)] leading-[1.6] text-body">
            Answer what you like and we write it down, or book a time and say it
            out loud. Whichever you pick, the same thing comes back: your scope,
            in your own words.
          </p>
        </div>
      </CutPanel>

      {/* The two routes, each on a surface of its own.

          No disc cut into the corner of these, though that is the site's rule
          for a way on. Each card already carries a named button going to the
          same place, and a card with two ways to press one link makes somebody
          work out whether they are the same thing. The rule is there so a
          control has somewhere to stand, not so that every card has a hole in
          it. */}
      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        {WAYS.map((way) => (
          <CutPanel
            key={way.href}
            tone="field"
            className="w-full"
          >
            <span
              aria-hidden
              className="flex size-11 items-center justify-center rounded-pill bg-canvas text-ink"
            >
              <way.icon className="size-5" strokeWidth={1.9} />
            </span>

            <p className="mt-5 font-mono text-[9px] font-bold tracking-[0.16em] text-mark uppercase">
              {way.kicker}
            </p>

            <h2 className="mt-2.5 max-w-[18ch] text-[clamp(20px,1.8vw,27px)] leading-[1.1] font-extrabold tracking-[-0.032em] text-ink">
              {way.n}
            </h2>

            <p className="mt-3 max-w-[44ch] text-[14px] leading-[1.65] text-body">
              {way.sub}
            </p>

            <Link
              href={way.href}
              className="group/go mt-6 inline-flex items-center gap-2 rounded-pill bg-ink px-4.5 py-2.5 text-[13.5px] font-semibold text-white transition-opacity hover:opacity-85"
            >
              {way.go}
              <ArrowUpRight
                aria-hidden
                className="size-4 transition-transform group-hover/go:translate-x-0.5 group-hover/go:-translate-y-0.5"
              />
            </Link>
          </CutPanel>
        ))}
      </div>

      {/* What is not here, said rather than faked. */}
      <section className="mt-14">
        <EmptyMark />

        <h2 className="mt-6 max-w-[26ch] text-[clamp(19px,1.6vw,24px)] leading-[1.16] font-extrabold tracking-[-0.03em] text-ink">
          A phone number, an address and an inbox.
        </h2>

        <p className="mt-3 max-w-[68ch] text-[15px] leading-[1.65] text-quiet">
          They belong on this page and they are not on it yet, because they are
          not written down anywhere for us to put here. A number nobody answers
          is worse than no number at all, so this says so instead. They go in the
          day they exist.
        </p>
      </section>
    </PageShell>
  );
}
