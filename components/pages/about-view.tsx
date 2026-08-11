import {
  ArrowUpRight,
  Boxes,
  CalendarClock,
  Compass,
  Globe,
  LifeBuoy,
  Megaphone,
  Palette,
  PencilLine,
  Phone,
} from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { PageShell } from "@/components/layout";
import { CutPanel } from "@/components/layout/cut-panel";
import { INCLUDED } from "@/lib/services";
import { CONTACT_INFO, ROUTES } from "@/lib/site";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   About us.

   Built out of the shapes the rest of the site is built out of - cut surfaces,
   one accent, no rules where space will do - rather than invented for this
   page. A page about how a company works that looks unlike the company's own
   work is arguing against itself.

   The order is the order somebody asks in: what this is, what you can buy,
   what every one of them includes, what runs alongside it, and how the whole
   thing actually proceeds.

   The three ways in appear three times, as the copy has them: at the top for
   somebody who arrived decided, under the eleven inclusions where the page
   first says something concrete enough to act on, and at the foot for somebody
   who read all of it.

   One thing the copy does that this does not: restate the thirteen steps. They
   have their own page now, drawn as one line, and telling them twice is how the
   two versions start to disagree. The count is read from that page's list
   rather than typed here, so it cannot go stale.
--------------------------------------------------------------------------- */

/** The two things you can actually buy, and who builds each. */
const OFFER = [
  {
    icon: Globe,
    kicker: "What we do",
    n: "Websites",
    sub: "From a handful of pages through to online shops, booking systems, and sites that connect to the software you already run.",
    by: "Built by TwinLoom",
  },
  {
    icon: Boxes,
    kicker: "What sits behind it",
    n: "Custom software",
    sub: "Managed software built for what your website sits on top of, by TwinCoreTech. Same group, same people to talk to.",
    by: "Built by TwinCoreTech",
  },
] as const;

/** Everything that is not the build. Ours, or a partner's, named either way. */
const SERVICES: readonly {
  icon: LucideIcon;
  n: string;
  sub: string;
  /**
   * Ours or a partner's. The one thing a reader wants resolved about these.
   *
   * Taken from the partners page's own disciplines rather than decided here:
   * brand and identity, and search and paid media, are two of the six named
   * there, and it says we apply a brand that exists while a partner makes one
   * that does not. Consultancy and the ongoing services are not on that list.
   */
  by: string;
}[] = [
  {
    icon: Compass,
    n: "Digital consultancy",
    sub: "Working out what the site has to do, who it is for, and what it needs to connect to.",
    by: "By us",
  },
  {
    icon: LifeBuoy,
    n: "Website Care",
    sub: "Keeping the site current once it is live, and the services that run alongside it: domain and business email, social media set-up and maintenance, and regular content.",
    by: "By us",
  },
  {
    icon: Palette,
    n: "Brand identity",
    sub: "Logo, visual identity, photography and imagery, artwork, and the words on the page.",
    by: "Us, or a partner",
  },
  {
    icon: Megaphone,
    n: "Digital campaign management",
    sub: "Running and measuring campaigns once the site is live.",
    by: "With a partner",
  },
];

/**
 * The three ways in, as one row.
 *
 * One filled and two quiet, because they are not three equal choices: writing
 * it down is the one that ends in something you can read, and the other two are
 * for people who would rather not start that way.
 */
function Ways({
  className,
  center,
}: {
  className?: string;
  /** On a panel whose words are centred, so the row is not the one thing left. */
  center?: boolean;
}) {
  return (
    <div className={className}>
      <div
        className={cn(
          /* A row on a screen, a column on a phone.

             Wrapped, the first pill took the whole width and the two under it
             split what was left - and they do not divide evenly: "Give us a
             call" is three short words and "Book a meeting" is three longer
             ones, so at half the width the second wrapped to two lines and the
             pair came out at two different heights beside each other. Three ways
             of doing one thing, drawn as one wide button and two uneven ones.

             Stacked, all three are the same width and the same height, which is
             what a set of alternatives should look like and what every other
             pair of doors on this site already does below `sm`. */
          "flex flex-wrap items-center gap-2.5 max-sm:flex-col max-sm:gap-2",
          center && "justify-center",
        )}
      >
        <Link
          href={ROUTES.build}
          className="group/one inline-flex items-center justify-center gap-2 rounded-pill bg-ink px-4.5 py-2.5 text-[13.5px] font-semibold text-white transition-opacity hover:opacity-85 max-sm:w-full max-sm:px-4 max-sm:text-[12.5px]"
        >
          <PencilLine aria-hidden className="size-4" strokeWidth={1.9} />
          Send us your requirements
          <ArrowUpRight
            aria-hidden
            className="size-4 transition-transform group-hover/one:translate-x-0.5 group-hover/one:-translate-y-0.5"
          />
        </Link>

        <a
          href={CONTACT_INFO.phoneHref}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-pill bg-canvas px-4 py-2.5 text-[13.5px] font-semibold text-ink transition-colors hover:bg-hair max-sm:w-full max-sm:flex-none max-sm:px-4 max-sm:text-[12.5px]"
        >
          <Phone aria-hidden className="size-4" strokeWidth={1.9} />
          Give us a call
        </a>

        <Link
          href={ROUTES.book}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-pill bg-canvas px-4 py-2.5 text-[13.5px] font-semibold text-ink transition-colors hover:bg-hair max-sm:w-full max-sm:flex-none max-sm:px-4 max-sm:text-[12.5px]"
        >
          <CalendarClock aria-hidden className="size-4" strokeWidth={1.9} />
          Book a meeting
        </Link>
      </div>
    </div>
  );
}

/** A heading and its one line under it, at the size this page uses for both. */
function Head({
  n,
  sub,
  className,
}: {
  n: React.ReactNode;
  sub: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <h2 className="max-w-[32ch] text-[clamp(21px,1.9vw,28px)] leading-[1.14] font-extrabold tracking-[-0.032em] text-ink max-sm:text-[19px]">
        {n}
      </h2>
      <p className="mt-3 max-w-[92ch] text-[15px] leading-[1.65] text-quiet max-sm:mt-2 max-sm:text-[13px] max-sm:leading-[1.55]">
        {sub}
      </p>
    </div>
  );
}

export function AboutView() {
  return (
    <PageShell>
      {/* White, like every other card on the site. The panel's own default is
          the canvas grey, and on a canvas page that makes the one card with a
          picture in it the one card that does not read as a card. */}
      {/* Arriving on the scroll. `reveal` is a class in the stylesheet and one
          observer already watches the whole document, so there is no JavaScript
          here and no wrapper per block; `--step` is the order, ninety
          milliseconds apart, and the page lands top to bottom. */}
      <CutPanel
        tone="field"
        className="reveal w-full"
        image="/partners/arch.png"
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
        <div className="max-w-[112ch]">
          <p className="font-mono text-[9px] font-bold tracking-[0.16em] text-mark uppercase">
            About TwinLoom
          </p>

          <h1 className="mt-3 max-w-[min(46ch,var(--notch-free,104ch))] text-[clamp(26px,2.9vw,42px)] leading-[1.05] font-extrabold tracking-[-0.04em] text-ink max-sm:mt-2 max-sm:text-[25px]">
            TwinLoom builds websites,
            <span className="text-quiet">
              {" "}
              supported by our digital and consultancy services.
            </span>
          </h1>

          <p className="mt-5 max-w-[110ch] text-[clamp(15px,1.2vw,17px)] leading-[1.6] text-body max-sm:mt-3 max-sm:text-[13px] max-sm:leading-[1.55]">
            TwinLoom is a trading name of TwinCoreTech, a SaaS company building
            custom software for businesses. If what sits behind your website
            needs building rather than buying, that work sits in the same group.
          </p>

          <Ways className="mt-7 max-sm:mt-5" />
        </div>
      </CutPanel>

      {/* What you can buy. Two surfaces rather than two paragraphs, because the
          distinction between them is the point: one is the site, the other is
          what the site sits on, and they are built by two halves of one
          group. */}
      <section className="reveal mt-14 [--step:1] max-sm:mt-9">
        <Head
          n="Our core offering."
          sub="Two things, and the second only where a website is not the whole of what you need."
        />

        <div className="mt-7 grid gap-4 max-sm:mt-5 max-sm:gap-3 lg:grid-cols-2">
          {OFFER.map((entry) => (
            <CutPanel
              key={entry.n}
              tone="field"
              className="w-full"
              foot={
                <span className="font-mono text-[9px] font-bold tracking-[0.14em] text-label uppercase">
                  {entry.by}
                </span>
              }
            >
              <span
                aria-hidden
                className="flex size-11 items-center justify-center rounded-pill bg-canvas text-ink max-sm:size-10"
              >
                <entry.icon
                  className="size-5 max-sm:size-[18px]"
                  strokeWidth={1.9}
                />
              </span>

              <p className="mt-5 font-mono text-[9px] font-bold tracking-[0.16em] text-mark uppercase max-sm:mt-3.5">
                {entry.kicker}
              </p>

              <h3 className="mt-2.5 text-[clamp(20px,1.8vw,27px)] leading-[1.1] font-extrabold tracking-[-0.032em] text-ink max-sm:mt-2 max-sm:text-[18px]">
                {entry.n}
              </h3>

              <p className="mt-3 max-w-[60ch] text-[14px] leading-[1.65] text-body max-sm:mt-2 max-sm:text-[13px] max-sm:leading-[1.55]">
                {entry.sub}
              </p>
            </CutPanel>
          ))}
        </div>
      </section>

      {/* The eleven, on one surface with the count standing in the bite.

          Numbered rather than ticked. A column of eleven ticks says the same
          thing eleven times; a column of numbers says how many there are, which
          is the actual claim - the list is the same length whatever the site
          costs. */}
      <section className="reveal mt-16 [--step:2] max-sm:mt-9">
        <CutPanel
          tone="field"
          className="w-full"
          aside={
            <div className="flex size-full flex-col items-center justify-center">
              <b className="font-mono text-[22px] leading-none font-bold text-ink tabular-nums">
                11
              </b>
              <span className="mt-1.5 font-mono text-[8px] font-bold tracking-[0.1em] text-label uppercase">
                Included
              </span>
            </div>
          }
          toolbar={
            <span className="flex h-10 w-full items-center justify-center font-mono text-[9px] font-bold tracking-[0.16em] text-label uppercase">
              Every site, whatever its size
            </span>
          }
        >
          {/* Centred, unlike every other panel on the page.

              The list under it is three columns across the whole surface, and a
              heading held to the left third above it left the top of the panel
              two thirds empty and the bottom of it full. Centred, the words sit
              over the middle of what they introduce.

              `mt-8` because the notch is at the top centre: with the heading on
              the left there was room beside it, and on the centre line there is
              not. */}
          <h2 className="mx-auto mt-8 max-w-[52ch] text-center text-[clamp(21px,1.9vw,28px)] leading-[1.14] font-extrabold tracking-[-0.032em] text-ink max-sm:mt-4 max-sm:text-[19px]">
            Every site we build gets the same eleven inclusions, whatever its
            size.
          </h2>

          <p className="mx-auto mt-3 max-w-[84ch] text-center text-[15px] leading-[1.65] text-quiet max-sm:mt-2 max-sm:text-[13px] max-sm:leading-[1.55]">
            Not a tier, not an upgrade, and not something to ask for. A five
            page site gets the list a fifty page site gets.
          </p>

          {/* The eleven stay left within their rows. A number, then a line of
              words, is a row that reads from one edge; centring each one would
              give eleven different left edges and nothing to run an eye down. */}
          {/* No cap, and four across at the widest.

                  It was held to 1440 and three columns, which on a window half
                  again as wide left a quarter of the page empty either side of
                  a list of eleven short lines - and eleven over three is a last
                  row with two in it. Four columns take the width the panel
                  already has, and the ragged row goes from two short to one. */}
          <ol className="mt-10 grid w-full gap-x-8 gap-y-3.5 max-sm:mt-6 max-sm:gap-y-2.5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {INCLUDED.map((line, n) => (
              <li
                key={line.say}
                className="flex min-w-0 gap-3.5 max-sm:gap-2.5"
              >
                <span
                  aria-hidden
                  className="mt-px flex size-6 flex-none items-center justify-center rounded-pill bg-canvas font-mono text-[9.5px] font-bold text-idx tabular-nums max-sm:size-5 max-sm:text-[9px]"
                >
                  {String(n + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 text-[13.5px] leading-[1.55] text-body max-sm:text-[12.5px] max-sm:leading-[1.5]">
                  {line.say}
                </span>
              </li>
            ))}
          </ol>

          {/* The ways again, under the list they belong to. Cut once as a
              repetition; it is not one - it is the first point in the page
              where somebody has read something concrete enough to act on. */}
          <Ways className="mt-10 max-sm:mt-6" center />
        </CutPanel>
      </section>

      {/* What runs alongside the build.

          On white, on one surface, four across. They were canvas-grey tiles on
          a canvas-grey page - the same colour as the ground they stood on - so
          there was no card there at all, only an icon and two lines of text
          floating in the middle of an empty half of the screen.

          Numbered, and each says whose it is. "Provided by us or through our
          specialist partners" is the one thing the reader wants resolved, and a
          sentence above four unlabelled boxes does not resolve it. */}
      <section className="reveal mt-16 [--step:3] max-sm:mt-9">
        <CutPanel
          tone="field"
          className="w-full"
          toolbar={
            <span className="flex h-10 w-full items-center justify-center font-mono text-[9px] font-bold tracking-[0.16em] text-label uppercase">
              Our services
            </span>
          }
          corner={
            <a
              href={ROUTES.services}
              aria-label="How partners work"
              title="How partners work"
              className="flex size-11 items-center justify-center rounded-pill bg-ink text-white transition-opacity hover:opacity-85"
            >
              <ArrowUpRight className="size-[18px]" strokeWidth={2.2} />
            </a>
          }
        >
          {/* Two lines where there were four.

              The heading was a definition - "everything that is not the build
              itself" - which is a thing you write when the list has no name. It
              has one. And the standfirst carried two more claims after the one
              that matters; both are made elsewhere on this page, and a panel
              that says everything says it to nobody. */}
          <h2 className="mx-auto mt-8 max-w-[52ch] text-center text-[clamp(21px,1.9vw,28px)] leading-[1.14] font-extrabold tracking-[-0.032em] text-ink max-sm:mt-4 max-sm:text-[19px]">
            Our services
          </h2>

          <p className="mx-auto mt-3 max-w-[84ch] text-center text-[15px] leading-[1.65] text-quiet max-sm:mt-2 max-sm:text-[13px] max-sm:leading-[1.55]">
            Provided by us or through our specialist partners.
          </p>

          <ul className="mt-10 grid w-full gap-3 max-sm:mt-6 max-sm:gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
            {SERVICES.map((service, n) => (
              <li
                key={service.n}
                className="group/svc flex min-w-0 flex-col rounded-[20px] bg-canvas p-5 transition-colors hover:bg-canvas-firm max-sm:rounded-[16px] max-sm:p-4"
              >
                <span className="flex items-center justify-between gap-3">
                  <span
                    aria-hidden
                    className="flex size-10 items-center justify-center rounded-pill bg-field text-ink transition-colors group-hover/svc:bg-ink group-hover/svc:text-white"
                  >
                    <service.icon className="size-[18px]" strokeWidth={1.9} />
                  </span>

                  <span className="font-mono text-[9.5px] font-bold text-idx tabular-nums">
                    {String(n + 1).padStart(2, "0")}
                  </span>
                </span>

                <b className="mt-4 block text-[15.5px] leading-[1.2] font-extrabold tracking-[-0.025em] text-ink max-sm:mt-3 max-sm:text-[14.5px]">
                  {service.n}
                </b>

                <p className="mt-2 flex-1 text-[13px] leading-[1.6] text-quiet max-sm:mt-1.5 max-sm:text-[12.5px] max-sm:leading-[1.55]">
                  {service.sub}
                </p>

                <span className="mt-4 font-mono text-[8.5px] font-bold tracking-[0.12em] text-label uppercase max-sm:mt-3">
                  {service.by}
                </span>
              </li>
            ))}
          </ul>
        </CutPanel>
      </section>

      {/* Nothing else on this page.

          Two sections came off the foot of it: the run of thirteen steps,
          and an ask under it.

          The steps were a summary of `/how-we-work`, which is a page of its
          own in the bar above - so this page ended by retelling another one,
          and the retelling was two paragraphs where the real thing is
          thirteen named steps on three surfaces. A link to it belongs here;
          a shorter copy of it does not.

          The ask went with it because the footer directly beneath this
          carries the same two ways in under the same kind of heading. Two
          asks, a screen apart, in one column, is the one thing every other
          page on this site is careful not to do - and the one that stays is
          the one on every page. */}
    </PageShell>
  );
}
