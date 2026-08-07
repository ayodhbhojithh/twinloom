import {
  ArrowUpRight,
  AtSign,
  Briefcase,
  CalendarClock,
  Clock,
  MapPin,
  PencilLine,
  Phone,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";

import { PageShell } from "@/components/layout";
import { CutPanel } from "@/components/layout/cut-panel";
import { ContactMap } from "@/components/pages/contact-map";
import { CONTACT_INFO, ROUTES } from "@/lib/site";

/* ---------------------------------------------------------------------------
   Contact us.

   The page used to say that the phone number, the address and the inbox did
   not exist yet. They do now, so the apology comes out and the details take
   the top of the page - which is what somebody who opened a contact page came
   for, whatever the rest of the site would rather they did first.

   Three registers, in the order a reader wants them:

     the lines that reach a person, and where we actually are
     the two ways in that end in a written scope
     the four inboxes, so nothing has to be forwarded twice

   Arranged in the site's own surfaces rather than as a list of icons and
   labels: an address is a fact, and a fact reads better set large on a surface
   of its own than shrunk into a row of tiles.
--------------------------------------------------------------------------- */

/** The four addresses, and the one thing each is for. */
const DESKS = [
  {
    icon: Briefcase,
    address: "sales@twincoretech.com",
    n: "New work",
    sub: "Quotes, scopes and anything about a project that has not started yet.",
  },
  {
    icon: Users,
    address: "careers@twincoretech.com",
    n: "Working with us",
    sub: "Applications, portfolios and speculative notes from people who build.",
  },
  {
    icon: ShieldCheck,
    address: "privacy@twincoretech.com",
    n: "Data and your rights",
    sub: "Access requests, deletion, and anything about what we hold and why.",
  },
] as const;

/** The ways in that end in something written. */
const WAYS = [
  {
    href: ROUTES.build,
    icon: PencilLine,
    kicker: "Best first move",
    n: "Tell us what the site is for",
    sub: "Ten questions, all of them optional, and a written scope back within two working days. It costs nothing and commits you to nothing.",
    go: "Start the run-through",
  },
  {
    href: ROUTES.book,
    icon: CalendarClock,
    kicker: "If you would rather talk",
    n: "Book a time",
    sub: "Pick a length and a slot. Come with the run-through done or come with nothing - both are a conversation we can have.",
    go: "Book a meeting",
  },
] as const;

export function ContactView() {
  return (
    <PageShell>
      {/* White, like every other card on the site. The panel's own default is
          the canvas grey, and on a canvas page that makes the one card with a
          picture in it the one card that does not read as a card. */}
      <CutPanel
        tone="field"
        className="w-full"
        image="/partners/hero-marble.png"
        /* The hours stand in the bottom notch. They are one line, they belong
           with the number rather than above it, and a notch holds exactly one
           line - which is the whole test for what goes in one. */
        foot={
          <span className="flex items-center gap-2 whitespace-nowrap">
            <Clock aria-hidden className="size-3.5 text-mark" strokeWidth={2} />
            <span className="font-mono text-[9.5px] font-bold tracking-[0.14em] text-label uppercase">
              {CONTACT_INFO.hours}
            </span>
          </span>
        }
        footIn="notch"
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

          <h1 className="mt-3 max-w-[min(19ch,var(--notch-free,62ch))] text-[clamp(26px,2.9vw,42px)] leading-[1.05] font-extrabold tracking-[-0.04em] text-ink">
            Write, ring, or come
            <span className="text-quiet"> and find us.</span>
          </h1>

          <p className="mt-4 text-[clamp(15px,1.2vw,17px)] leading-[1.6] text-body">
            A person reads every one of these, and answers within a working day.
            None of them is a form, and none of them puts you on a list.
          </p>
        </div>
      </CutPanel>

      {/* The lines that reach a person, and the place they sit in.

          Two surfaces rather than one row of tiles: the address is a different
          kind of fact from a number you can press, and giving each its own
          shape is cheaper to read than four identical boxes that happen to
          hold different things. */}
      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <CutPanel
          tone="field"
          className="w-full"
          toolbar={
            <span className="flex h-10 w-full items-center justify-center font-mono text-[9px] font-bold tracking-[0.16em] text-label uppercase">
              Direct lines
            </span>
          }
        >
          {/* Set large, because they are the answer to the question the page
              was opened with. A contact detail in body copy is a contact
              detail somebody has to hunt for. */}
          <dl className="mt-2 flex flex-col gap-6">
            <div>
              <dt className="flex items-center gap-2 font-mono text-[9px] font-bold tracking-[0.14em] text-label uppercase">
                <AtSign aria-hidden className="size-3.5" strokeWidth={2.2} />
                Email
              </dt>
              <dd className="mt-2">
                <a
                  href={`mailto:${CONTACT_INFO.primaryEmail}`}
                  className="inline-block text-[clamp(17px,1.7vw,23px)] leading-[1.15] font-extrabold tracking-[-0.035em] break-all text-ink transition-colors hover:text-mark"
                >
                  {CONTACT_INFO.primaryEmail}
                </a>
              </dd>
            </div>

            <div>
              <dt className="flex items-center gap-2 font-mono text-[9px] font-bold tracking-[0.14em] text-label uppercase">
                <Phone aria-hidden className="size-3.5" strokeWidth={2.2} />
                Phone
              </dt>
              <dd className="mt-2">
                <a
                  href={CONTACT_INFO.phoneHref}
                  className="inline-block text-[clamp(17px,1.7vw,23px)] leading-[1.15] font-extrabold tracking-[-0.035em] text-ink transition-colors hover:text-mark"
                >
                  {CONTACT_INFO.phone}
                </a>
              </dd>
            </div>
          </dl>

          <p className="mt-7 max-w-[42ch] text-[13.5px] leading-[1.6] text-quiet">
            Outside those hours the line goes to voicemail and the inbox is read
            the next morning. Both are answered by the people who would do the
            work.
          </p>
        </CutPanel>

        <CutPanel
          tone="field"
          className="w-full"
          toolbar={
            <span className="flex h-10 w-full items-center justify-center font-mono text-[9px] font-bold tracking-[0.16em] text-label uppercase">
              Where we are
            </span>
          }
        >
          <address className="mt-2 flex gap-3 not-italic">
            <MapPin
              aria-hidden
              className="mt-1 size-4 flex-none text-mark"
              strokeWidth={2.2}
            />
            <span className="min-w-0">
              <b className="block text-[clamp(16px,1.4vw,19px)] leading-[1.2] font-extrabold tracking-[-0.03em] text-ink">
                {CONTACT_INFO.address.name}
              </b>
              <span className="mt-1.5 block text-[14px] leading-[1.6] text-body">
                {CONTACT_INFO.address.street}
                <br />
                {CONTACT_INFO.address.cityLine}
              </span>
            </span>
          </address>

          {/* The map is cut to the site's outline and carries the way out to
              the real one in its corner, so nothing has to sit under it saying
              "open in maps". */}
          <ContactMap className="group/map relative mt-5 block h-[clamp(190px,20vw,240px)] w-full cursor-pointer" />
        </CutPanel>
      </div>

      {/* The two routes, each on a surface of its own.

          No disc cut into the corner of these, though that is the site's rule
          for a way on. Each card already carries a named button going to the
          same place, and a card with two ways to press one link makes somebody
          work out whether they are the same thing. The rule is there so a
          control has somewhere to stand, not so that every card has a hole in
          it. */}
      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        {WAYS.map((way) => (
          <CutPanel key={way.href} tone="field" className="w-full">
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

      {/* The other three inboxes.

          Written out rather than hidden behind the word "here", because half
          of what these get is a message somebody would rather send from their
          own mail client than from a browser. */}
      <section className="mt-10">
        <CutPanel
          tone="field"
          className="w-full"
          toolbar={
            <span className="flex h-10 w-full items-center justify-center font-mono text-[9px] font-bold tracking-[0.16em] text-label uppercase">
              Straight to a desk
            </span>
          }
        >
          <h2 className="max-w-[min(24ch,var(--notch-free,62ch))] text-[clamp(19px,1.7vw,26px)] leading-[1.12] font-extrabold tracking-[-0.035em] text-ink">
            Three addresses, so nothing gets forwarded twice.
          </h2>

          <ul className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {DESKS.map((desk) => (
              <li key={desk.address}>
                <a
                  href={`mailto:${desk.address}`}
                  className="group/desk flex h-full flex-col rounded-[18px] bg-canvas p-5 transition-colors hover:bg-canvas-firm"
                >
                  <span
                    aria-hidden
                    className="flex size-9 items-center justify-center rounded-pill bg-field text-ink"
                  >
                    <desk.icon className="size-4" strokeWidth={2} />
                  </span>

                  <b className="mt-4 block text-[15px] leading-[1.2] font-extrabold tracking-[-0.025em] text-ink">
                    {desk.n}
                  </b>

                  <span className="mt-2 block flex-1 text-[13px] leading-[1.55] text-quiet">
                    {desk.sub}
                  </span>

                  <span className="mt-4 flex items-center gap-1.5 font-mono text-[10.5px] font-semibold break-all text-mark">
                    {desk.address}
                    <ArrowUpRight
                      aria-hidden
                      className="size-3.5 flex-none transition-transform group-hover/desk:translate-x-0.5 group-hover/desk:-translate-y-0.5"
                    />
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <p className="mt-7 max-w-[68ch] text-[12.5px] leading-[1.6] text-label">
            {CONTACT_INFO.companyName}. If you are not sure which of these it
            is, use{" "}
            <a
              href={`mailto:${CONTACT_INFO.primaryEmail}`}
              className="font-semibold text-body underline decoration-hair underline-offset-2 transition-colors hover:text-mark hover:decoration-mark"
            >
              {CONTACT_INFO.primaryEmail}
            </a>{" "}
            and it will get to the right desk.
          </p>
        </CutPanel>
      </section>
    </PageShell>
  );
}
