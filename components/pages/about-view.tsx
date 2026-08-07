import {
  ArrowUpRight,
  Boxes,
  CalendarClock,
  Compass,
  Globe,
  Handshake,
  LifeBuoy,
  Megaphone,
  Palette,
  PencilLine,
  Phone,
  Route,
} from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { PageShell } from "@/components/layout";
import { CutPanel } from "@/components/layout/cut-panel";
import { PartnerWall } from "@/components/pages/partners-view";
import { STOPS } from "@/lib/journey";
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

/**
 * What every site gets, whatever it costs.
 *
 * Written as the eleven separate promises they are rather than compressed into
 * four bullets with commas in them. Each one is a thing that either happened or
 * did not, which is the only kind of inclusion worth listing.
 */
const INCLUDED = [
  "It works on a phone, a tablet and a computer",
  "Your visual identity, applied to layouts we already have",
  "Set up so search engines can find and read every page",
  "Secure, with access managed where it is needed",
  "Hosted, backed up and monitored",
  "Built to load quickly and stay still while it loads",
  "Reviewed for accessibility before it goes live",
  "An enquiry form that reaches the right inbox",
  "Analytics and Search Console, in accounts you own",
  "Two weeks of attention after launch",
  "A handover pack, and a session with the people who will use it",
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
    n: "Ongoing services",
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
          "flex flex-wrap items-center gap-2.5",
          center && "justify-center",
        )}
      >
        <Link
          href={ROUTES.build}
          className="group/one inline-flex items-center gap-2 rounded-pill bg-ink px-4.5 py-2.5 text-[13.5px] font-semibold text-white transition-opacity hover:opacity-85"
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
          className="inline-flex items-center gap-2 rounded-pill bg-canvas px-4 py-2.5 text-[13.5px] font-semibold text-ink transition-colors hover:bg-hair"
        >
          <Phone aria-hidden className="size-4" strokeWidth={1.9} />
          Give us a call
        </a>

        <Link
          href={ROUTES.book}
          className="inline-flex items-center gap-2 rounded-pill bg-canvas px-4 py-2.5 text-[13.5px] font-semibold text-ink transition-colors hover:bg-hair"
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
      <h2 className="max-w-[24ch] text-[clamp(21px,1.9vw,28px)] leading-[1.14] font-extrabold tracking-[-0.032em] text-ink">
        {n}
      </h2>
      <p className="mt-3 max-w-[70ch] text-[15px] leading-[1.65] text-quiet">
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
      <CutPanel
        tone="field"
        className="w-full"
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
        <div className="max-w-[76ch]">
          <p className="font-mono text-[9px] font-bold tracking-[0.16em] text-mark uppercase">
            About TwinLoom
          </p>

          <h1 className="mt-3 max-w-[min(28ch,var(--notch-free,72ch))] text-[clamp(26px,2.9vw,42px)] leading-[1.05] font-extrabold tracking-[-0.04em] text-ink">
            TwinLoom builds websites,
            <span className="text-quiet">
              {" "}
              supported by our digital and consultancy services.
            </span>
          </h1>

          <p className="mt-5 max-w-[74ch] text-[clamp(15px,1.2vw,17px)] leading-[1.6] text-body">
            TwinLoom is a trading name of TwinCoreTech, a SaaS company building
            custom software for businesses. If what sits behind your website
            needs building rather than buying, that work sits in the same group.
          </p>

          <Ways className="mt-7" />
        </div>
      </CutPanel>

      {/* What you can buy. Two surfaces rather than two paragraphs, because the
          distinction between them is the point: one is the site, the other is
          what the site sits on, and they are built by two halves of one
          group. */}
      <section className="mt-14">
        <Head
          n="Our core offering."
          sub="Two things, and the second only where a website is not the whole of what you need."
        />

        <div className="mt-7 grid gap-4 lg:grid-cols-2">
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
                className="flex size-11 items-center justify-center rounded-pill bg-canvas text-ink"
              >
                <entry.icon className="size-5" strokeWidth={1.9} />
              </span>

              <p className="mt-5 font-mono text-[9px] font-bold tracking-[0.16em] text-mark uppercase">
                {entry.kicker}
              </p>

              <h3 className="mt-2.5 text-[clamp(20px,1.8vw,27px)] leading-[1.1] font-extrabold tracking-[-0.032em] text-ink">
                {entry.n}
              </h3>

              <p className="mt-3 max-w-[46ch] text-[14px] leading-[1.65] text-body">
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
      <section className="mt-16">
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
          <h2 className="mx-auto mt-8 max-w-[30ch] text-center text-[clamp(21px,1.9vw,28px)] leading-[1.14] font-extrabold tracking-[-0.032em] text-ink">
            Every site we build gets the same eleven inclusions, whatever its
            size.
          </h2>

          <p className="mx-auto mt-3 max-w-[64ch] text-center text-[15px] leading-[1.65] text-quiet">
            Not a tier, not an upgrade, and not something to ask for. A five page
            site gets the list a fifty page site gets.
          </p>

          {/* The eleven stay left within their rows. A number, then a line of
              words, is a row that reads from one edge; centring each one would
              give eleven different left edges and nothing to run an eye down. */}
          <ol className="mx-auto mt-10 grid w-full max-w-[1440px] gap-x-8 gap-y-3.5 sm:grid-cols-2 xl:grid-cols-3">
            {INCLUDED.map((line, n) => (
              <li key={line} className="flex min-w-0 gap-3.5">
                <span
                  aria-hidden
                  className="mt-px flex size-6 flex-none items-center justify-center rounded-pill bg-canvas font-mono text-[9.5px] font-bold text-idx tabular-nums"
                >
                  {String(n + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 text-[13.5px] leading-[1.55] text-body">
                  {line}
                </span>
              </li>
            ))}
          </ol>

          {/* The ways again, under the list they belong to. Cut once as a
              repetition; it is not one - it is the first point in the page
              where somebody has read something concrete enough to act on. */}
          <Ways className="mt-10" center />
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
      <section className="mt-16">
        <CutPanel
          tone="field"
          className="w-full"
          toolbar={
            <span className="flex h-10 w-full items-center justify-center font-mono text-[9px] font-bold tracking-[0.16em] text-label uppercase">
              Our services
            </span>
          }
          corner={
            <Link
              href={ROUTES.partners}
              aria-label="How partners work"
              title="How partners work"
              className="flex size-11 items-center justify-center rounded-pill bg-ink text-white transition-opacity hover:opacity-85"
            >
              <ArrowUpRight className="size-[18px]" strokeWidth={2.2} />
            </Link>
          }
        >
          <h2 className="mx-auto mt-8 max-w-[30ch] text-center text-[clamp(21px,1.9vw,28px)] leading-[1.14] font-extrabold tracking-[-0.032em] text-ink">
            Everything that is not the build itself.
          </h2>

          <p className="mx-auto mt-3 max-w-[62ch] text-center text-[15px] leading-[1.65] text-quiet">
            Provided by us or through our specialist partners, and named in the
            proposal before the work starts either way. Take any of them, or
            none.
          </p>

          <ul className="mx-auto mt-10 grid w-full max-w-[1440px] gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {SERVICES.map((service, n) => (
              <li
                key={service.n}
                className="group/svc flex min-w-0 flex-col rounded-[20px] bg-canvas p-5 transition-colors hover:bg-canvas-firm"
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

                <b className="mt-4 block text-[15.5px] leading-[1.2] font-extrabold tracking-[-0.025em] text-ink">
                  {service.n}
                </b>

                <p className="mt-2 flex-1 text-[13px] leading-[1.6] text-quiet">
                  {service.sub}
                </p>

                <span className="mt-4 font-mono text-[8.5px] font-bold tracking-[0.12em] text-label uppercase">
                  {service.by}
                </span>
              </li>
            ))}
          </ul>
        </CutPanel>
      </section>

      {/* How it proceeds. The count comes from the run itself rather than from
          a number typed on this page, so adding a step cannot leave this saying
          thirteen. */}
      <section className="mt-16">
        <Head
          n="How we work."
          sub={`We work in ${STOPS.length} steps, from the first conversation to the site going live. You can see all ${STOPS.length} before you commit to any of them.`}
        />

        <CutPanel
          tone="field"
          className="mt-7 w-full"
          corner={
            <Link
              href={ROUTES.how}
              aria-label="See how we work"
              title="See how we work"
              className="flex size-11 items-center justify-center rounded-pill bg-ink text-white transition-opacity hover:opacity-85"
            >
              <ArrowUpRight className="size-[18px]" strokeWidth={2.2} />
            </Link>
          }
        >
          <h3 className="max-w-[min(24ch,var(--notch-free,62ch))] text-[clamp(19px,1.7vw,25px)] leading-[1.14] font-extrabold tracking-[-0.032em] text-ink">
            It starts with scoping.
          </h3>

          <div className="mt-5 grid max-w-[104ch] gap-x-10 gap-y-4 lg:grid-cols-2">
            <p className="text-[15px] leading-[1.65] text-body">
              It starts with scoping. Tell us what you want in your own words and
              send it, in as little or as much detail as you like. We come back
              to you to work through the next steps and the detail.
            </p>

            <p className="text-[15px] leading-[1.65] text-body">
              What comes back is a written scope, in your words, inside two
              working days. It is a description of a website, not a quote.
              Nothing in it is priced, and nothing you answer locks anything in.
            </p>
          </div>

          <Link
            href={ROUTES.how}
            className="group/all mt-7 inline-flex items-center gap-2 rounded-pill bg-canvas px-4.5 py-2.5 text-[13.5px] font-semibold text-ink transition-colors hover:bg-hair"
          >
            <Route aria-hidden className="size-4" strokeWidth={1.9} />
            See all {STOPS.length} steps
            <ArrowUpRight
              aria-hidden
              className="size-4 transition-transform group-hover/all:translate-x-0.5 group-hover/all:-translate-y-0.5"
            />
          </Link>
        </CutPanel>
      </section>

      {/* The partners, borrowed from their own page rather than restated. */}
      <section className="mt-16">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <Head
            className="min-w-0"
            n="Specialists are part of the build."
            sub="Named in the proposal before the work starts, on one contract and one invoice. Most projects need none of them."
          />

          <Link
            href={ROUTES.partners}
            className="group/all inline-flex flex-none items-center gap-2 rounded-pill bg-canvas px-4.5 py-2 text-[13.5px] font-semibold text-ink transition-colors hover:bg-hair"
          >
            <Handshake aria-hidden className="size-4" strokeWidth={1.9} />
            How partners work
            <ArrowUpRight
              aria-hidden
              className="size-4 transition-transform group-hover/all:translate-x-0.5 group-hover/all:-translate-y-0.5"
            />
          </Link>
        </div>

        <PartnerWall className="mt-7" />
      </section>

      {/* The second and last time the three ways are offered: at the foot, to
          somebody who has now read the page. */}
      <section className="mt-16">
        <CutPanel tone="field" className="w-full">
          <h2 className="max-w-[min(20ch,var(--notch-free,62ch))] text-[clamp(21px,1.9vw,28px)] leading-[1.14] font-extrabold tracking-[-0.032em] text-ink">
            Say what you want, however you want.
          </h2>

          <p className="mt-3 max-w-[64ch] text-[15px] leading-[1.65] text-quiet">
            In writing, out loud, or in a slot in the diary. All three end in the
            same written scope, and none of them is a form.
          </p>

          <Ways className="mt-7" />
        </CutPanel>
      </section>
    </PageShell>
  );
}
