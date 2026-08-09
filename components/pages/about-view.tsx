import {
  ArrowRight,
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
  Route,
} from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { PageShell } from "@/components/layout";
import { CutPanel } from "@/components/layout/cut-panel";
import { STOPS } from "@/lib/journey";
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
      <h2 className="max-w-[32ch] text-[clamp(21px,1.9vw,28px)] leading-[1.14] font-extrabold tracking-[-0.032em] text-ink">
        {n}
      </h2>
      <p className="mt-3 max-w-[92ch] text-[15px] leading-[1.65] text-quiet">
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
        <div className="max-w-[112ch]">
          <p className="font-mono text-[9px] font-bold tracking-[0.16em] text-mark uppercase">
            About TwinLoom
          </p>

          <h1 className="mt-3 max-w-[min(46ch,var(--notch-free,104ch))] text-[clamp(26px,2.9vw,42px)] leading-[1.05] font-extrabold tracking-[-0.04em] text-ink">
            TwinLoom builds websites,
            <span className="text-quiet">
              {" "}
              supported by our digital and consultancy services.
            </span>
          </h1>

          <p className="mt-5 max-w-[110ch] text-[clamp(15px,1.2vw,17px)] leading-[1.6] text-body">
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

              <p className="mt-3 max-w-[60ch] text-[14px] leading-[1.65] text-body">
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
          <h2 className="mx-auto mt-8 max-w-[52ch] text-center text-[clamp(21px,1.9vw,28px)] leading-[1.14] font-extrabold tracking-[-0.032em] text-ink">
            Every site we build gets the same eleven inclusions, whatever its
            size.
          </h2>

          <p className="mx-auto mt-3 max-w-[84ch] text-center text-[15px] leading-[1.65] text-quiet">
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
          <ol className="mt-10 grid w-full gap-x-8 gap-y-3.5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {INCLUDED.map((line, n) => (
              <li key={line.say} className="flex min-w-0 gap-3.5">
                <span
                  aria-hidden
                  className="mt-px flex size-6 flex-none items-center justify-center rounded-pill bg-canvas font-mono text-[9.5px] font-bold text-idx tabular-nums"
                >
                  {String(n + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 text-[13.5px] leading-[1.55] text-body">
                  {line.say}
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
          <h2 className="mx-auto mt-8 max-w-[52ch] text-center text-[clamp(21px,1.9vw,28px)] leading-[1.14] font-extrabold tracking-[-0.032em] text-ink">
            Our services
          </h2>

          <p className="mx-auto mt-3 max-w-[84ch] text-center text-[15px] leading-[1.65] text-quiet">
            Provided by us or through our specialist partners.
          </p>

          <ul className="mt-10 grid w-full gap-3 sm:grid-cols-2 xl:grid-cols-4">
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
          n="How we work"
          sub={`From the first conversation to the site going live, in ${STOPS.length} steps. You can see all of them before you commit to any.`}
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
          <h3 className="max-w-[min(44ch,var(--notch-free,96ch))] text-[clamp(19px,1.7vw,25px)] leading-[1.14] font-extrabold tracking-[-0.032em] text-ink">
            It starts with a conversation.
          </h3>

          {/* Two paragraphs and a break between them, and the break is the
              point: the first is everything before the work is agreed and the
              second is everything after it. Written as one column of two rather
              than two columns of one, because they are consecutive - side by
              side, the eye reads whichever is nearer first. */}
          {/* Wider, and still capped. Everything else on this page can take
              the window; prose cannot - a line of text the width of a desk is a
              line the eye loses its place in on the way back. The cap is what
              keeps this two columns of sixty rather than one of a hundred and
              twenty. */}
          <div className="mt-5 grid max-w-[128ch] gap-x-14 gap-y-4 lg:grid-cols-2">
            <p className="text-[15px] leading-[1.65] text-body">
              Start by booking a meeting to talk through what you need. Or, if
              you have already done some thinking, send us your requirements in
              as little or as much detail as you want - send it straight away,
              or work through the scoping questions first.
            </p>

            <p className="text-[15px] leading-[1.65] text-body">
              Once the scope is agreed and the contract is signed, we start your
              project and keep you informed all the way through.
            </p>
          </div>

          {/* The way to the whole of it, and then the three ways to start it.

              "See all thirteen steps" counted the run for you, which is a
              precise number in a place nobody needs one - and it made the link a
              statistic rather than an invitation. The three ways under it are
              the same three this page offers at its foot; here they are the
              answer to a paragraph that has just told you what happens next. */}
          <Link
            href={ROUTES.how}
            className="group/all mt-7 inline-flex items-center gap-2 rounded-pill bg-canvas px-4.5 py-2.5 text-[13.5px] font-semibold text-ink transition-colors hover:bg-hair"
          >
            <Route aria-hidden className="size-4" strokeWidth={1.9} />
            See how we work
            <ArrowUpRight
              aria-hidden
              className="size-4 transition-transform group-hover/all:translate-x-0.5 group-hover/all:-translate-y-0.5"
            />
          </Link>

          <Ways className="mt-5" />
        </CutPanel>
      </section>

      {/* The end of the page, and one panel rather than two.

          Two stood here: a wall of specialist disciplines, and an ask under it.
          The wall is gone because this page is about who we are, and a row of
          six trades read from the services list was that page answering a
          question this one had not asked - it is still on `/services`, where
          somebody looking for it is looking for it.

          The ask that stood below it went with it, not as well. Its words are
          here: leaving both would be two panels in a row asking for the same
          thing, which is the one thing every other page on this site is careful
          not to do.

          Two ways rather than three. Writing it down and putting it in the diary
          are the two anybody actually chooses between, and a third option in a
          row of three is a third of the attention gone. */}
      <section className="mt-16">
        <CutPanel tone="field" className="w-full">
          <h2 className="max-w-[min(40ch,var(--notch-free,96ch))] text-[clamp(21px,1.9vw,28px)] leading-[1.14] font-extrabold tracking-[-0.032em] text-ink">
            Start with what you need.
          </h2>

          <p className="mt-3 max-w-[100ch] text-[15px] leading-[1.65] text-quiet">
            Tell us what you are looking to build, improve or connect. We will
            help you work out the rest.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-2.5">
            <Link
              href={ROUTES.build}
              className="group/way thread-fill inline-flex items-center gap-2 rounded-pill px-5 py-3 text-[14.5px] font-semibold whitespace-nowrap transition-opacity hover:opacity-90"
            >
              Send us your requirements
              <ArrowRight
                aria-hidden
                className="size-4 shrink-0 transition-transform group-hover/way:translate-x-0.5"
                strokeWidth={2.4}
              />
            </Link>

            <Link
              href={ROUTES.book}
              className="group/way inline-flex items-center gap-2 rounded-pill border border-hair bg-field px-5 py-3 text-[14.5px] font-semibold whitespace-nowrap text-ink transition-colors hover:border-ink"
            >
              Book a meeting
              <ArrowUpRight
                aria-hidden
                className="size-4 shrink-0 transition-transform group-hover/way:translate-x-0.5 group-hover/way:-translate-y-0.5"
              />
            </Link>
          </div>
        </CutPanel>
      </section>
    </PageShell>
  );
}
