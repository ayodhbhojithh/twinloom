import {
  ArrowUpRight,
  AtSign,
  CalendarClock,
  Clock,
  MapPin,
  Phone,
} from "lucide-react";
import Link from "next/link";

import { PageShell } from "@/components/layout";
import { CutPanel } from "@/components/layout/cut-panel";
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

/* The desks and the two ways are gone with the sections that used them.

   `DESKS` listed three inboxes - sales, careers, privacy - under a heading
   about nothing being forwarded twice, which is an explanation of our mail
   routing given to somebody who came here to ask a question. `WAYS` was two
   cards offering the run-through and a meeting, and the page now offers four
   things in a stated order rather than two in no order at all.

   The addresses themselves are still in `CONTACT_INFO`, where the legal pages
   read them. */

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
        <div className="max-w-[104ch]">
          <p className="font-mono text-[9px] font-bold tracking-[0.16em] text-mark uppercase">
            Contact us
          </p>

          {/* The heading says what the page is, and nothing more.

              It read "Write, ring, or come and find us." - three verbs for the
              three things listed underneath, which is a heading naming its own
              contents before anybody has reached them. The kicker above already
              says Contact us; saying it again in a sentence is the page
              introducing itself twice. */}
          <h1 className="mt-3 max-w-[min(30ch,var(--notch-free,86ch))] text-[clamp(26px,2.9vw,42px)] leading-[1.05] font-extrabold tracking-[-0.04em] text-ink">
            Contact us.
          </h1>

          <p className="mt-4 text-[clamp(15px,1.2vw,17px)] leading-[1.6] text-body">
            A person reads every one of these, and answers within a working day.
            None of them is a form, and none of them puts you on a list.
          </p>

          {/* Which company is which, said once and said here.

              Every address, the number and the registered office on this page
              belong to TwinCoreTech, and somebody who wrote to TwinLoom has a
              right to know why the reply comes from a name they have not seen.
              Small, under the paragraph, because it is a fact rather than a
              claim. */}
          <p className="mt-4 max-w-[90ch] text-[13.5px] leading-[1.6] text-quiet">
            TwinLoom is the website development and digital services arm of
            TwinCoreTech.
          </p>
        </div>
      </CutPanel>

      {/* Four ways, in the order they are worth trying.

          Numbered, and the numbers are the point. This page used to be two
          cards, then a two-up of details, then a panel of three more inboxes -
          four arrangements for one question, and nothing saying which to use.
          One numbered column says it: a meeting first because it is the one
          that ends in a conversation, then writing, then ringing, then the door.

          The panel of extra inboxes is gone entirely. It listed three addresses
          and explained that nothing gets forwarded twice, which is an
          explanation of our mail routing offered to somebody who wanted to ask a
          question. One address, and it reaches a person. */}

      {/* 01. A meeting. */}
      <section className="mt-4">
        <CutPanel
          tone="field"
          className="w-full"
          toolbar={
            <span className="flex h-10 w-full items-center justify-center font-mono text-[9px] font-bold tracking-[0.16em] text-label uppercase">
              01 &middot; Best first move
            </span>
          }
          corner={
            <Link
              href={ROUTES.book}
              aria-label="Book a meeting"
              title="Book a meeting"
              className="flex size-11 items-center justify-center rounded-pill bg-ink text-white transition-opacity hover:opacity-85"
            >
              <ArrowUpRight className="size-[18px]" strokeWidth={2.2} />
            </Link>
          }
        >
          <span
            aria-hidden
            className="mt-2 flex size-11 items-center justify-center rounded-pill bg-canvas text-ink"
          >
            <CalendarClock className="size-5" strokeWidth={1.9} />
          </span>

          <h2 className="mt-5 max-w-[min(20ch,var(--notch-free,62ch))] text-[clamp(20px,1.8vw,27px)] leading-[1.1] font-extrabold tracking-[-0.032em] text-ink">
            Book a meeting
          </h2>

          <p className="mt-3 max-w-[60ch] text-[14.5px] leading-[1.65] text-body">
            Pick a length and a slot. Come with your requirements written down
            or come with nothing - both are a conversation we can have.
          </p>

          <Link
            href={ROUTES.book}
            className="group/go mt-6 inline-flex items-center gap-2 rounded-pill bg-ink px-5 py-3 text-[14px] font-semibold text-white transition-opacity hover:opacity-85"
          >
            Book a meeting
            <ArrowUpRight
              aria-hidden
              className="size-4 transition-transform group-hover/go:translate-x-0.5 group-hover/go:-translate-y-0.5"
            />
          </Link>
        </CutPanel>
      </section>

      {/* 02 and 03. Writing and ringing, side by side on a wide window because
          they are the same kind of thing: one line each, and both of them
          pressable. */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <CutPanel
          tone="field"
          className="w-full"
          toolbar={
            <span className="flex h-10 w-full items-center justify-center font-mono text-[9px] font-bold tracking-[0.16em] text-label uppercase">
              02 &middot; Email us
            </span>
          }
        >
          <span
            aria-hidden
            className="mt-2 flex size-11 items-center justify-center rounded-pill bg-canvas text-ink"
          >
            <AtSign className="size-5" strokeWidth={1.9} />
          </span>

          {/* Set large, because it is the answer to the question the page was
              opened with. A contact detail in body copy is a contact detail
              somebody has to hunt for. */}
          <a
            href={`mailto:${CONTACT_INFO.primaryEmail}`}
            className="mt-5 inline-block text-[clamp(17px,1.7vw,23px)] leading-[1.15] font-extrabold tracking-[-0.035em] break-all text-ink transition-colors hover:text-mark"
          >
            {CONTACT_INFO.primaryEmail}
          </a>

          <p className="mt-4 max-w-[46ch] text-[13.5px] leading-[1.6] text-quiet">
            Read the same morning it arrives, and answered by the people who
            would do the work.
          </p>
        </CutPanel>

        <CutPanel
          tone="field"
          className="w-full"
          toolbar={
            <span className="flex h-10 w-full items-center justify-center font-mono text-[9px] font-bold tracking-[0.16em] text-label uppercase">
              03 &middot; Call us
            </span>
          }
          /* The hours stand in the bottom notch. They are one line, they belong
             with the number rather than above it, and a notch holds exactly one
             line - which is the whole test for what goes in one. */
          foot={
            <span className="flex items-center gap-2 whitespace-nowrap">
              <Clock
                aria-hidden
                className="size-3.5 text-mark"
                strokeWidth={2}
              />
              <span className="font-mono text-[9.5px] font-bold tracking-[0.14em] text-label uppercase">
                {CONTACT_INFO.hours}
              </span>
            </span>
          }
          footIn="notch"
        >
          <span
            aria-hidden
            className="mt-2 flex size-11 items-center justify-center rounded-pill bg-canvas text-ink"
          >
            <Phone className="size-5" strokeWidth={1.9} />
          </span>

          <a
            href={CONTACT_INFO.phoneHref}
            className="mt-5 inline-block text-[clamp(17px,1.7vw,23px)] leading-[1.15] font-extrabold tracking-[-0.035em] text-ink transition-colors hover:text-mark"
          >
            {CONTACT_INFO.phone}
          </a>

          <p className="mt-4 max-w-[46ch] text-[13.5px] leading-[1.6] text-quiet">
            Outside those hours the line goes to voicemail, and it is listened
            to the next morning.
          </p>
        </CutPanel>
      </div>

      {/* 04. Where we are, on an envelope's worth of lines. */}
      <section className="mt-4">
        <CutPanel
          tone="field"
          className="w-full"
          toolbar={
            <span className="flex h-10 w-full items-center justify-center font-mono text-[9px] font-bold tracking-[0.16em] text-label uppercase">
              04 &middot; Address
            </span>
          }
        >
          {/* No map beside it.

              An embedded map is a picture of a place somebody either already
              knows or is going to open in their own maps app anyway, and it
              took the larger half of this panel to say what the five lines to
              the left of it had already said. The button is the whole of what
              it was for.

              Which leaves the address on the panel's own width rather than in a
              column sized to balance a picture: the lines set on one edge, the
              way out under them, and nothing to align to but the surface. */}
          <address className="mt-2 flex gap-3 not-italic">
            <MapPin
              aria-hidden
              className="mt-1 size-4 flex-none text-mark"
              strokeWidth={2.2}
            />
            <span className="min-w-0">
              <b className="block text-[clamp(16px,1.4vw,19px)] leading-[1.2] font-extrabold tracking-[-0.03em] text-ink">
                {CONTACT_INFO.companyName}
              </b>
              <span className="mt-1.5 block text-[14.5px] leading-[1.7] text-body">
                {CONTACT_INFO.address.name}
                <br />
                {CONTACT_INFO.address.street}
                <br />
                {CONTACT_INFO.address.town}
                <br />
                {CONTACT_INFO.address.postcode}
                <br />
                {CONTACT_INFO.address.country}
              </span>

              <a
                href={CONTACT_INFO.address.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="group/map mt-5 inline-flex items-center gap-2 rounded-pill bg-canvas px-4.5 py-2.5 text-[13.5px] font-semibold text-ink transition-colors hover:bg-hair"
              >
                <MapPin aria-hidden className="size-4" strokeWidth={1.9} />
                Open in Google Maps
                <ArrowUpRight
                  aria-hidden
                  className="size-4 transition-transform group-hover/map:translate-x-0.5 group-hover/map:-translate-y-0.5"
                />
              </a>
            </span>
          </address>
        </CutPanel>
      </section>
    </PageShell>
  );
}
