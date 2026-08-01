import Image from "next/image";
import Link from "next/link";
import { Check, Clock, FileText } from "lucide-react";

import { ROUTES, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The three promises, given a face each.
 *
 * One accent apiece, in the order the palette already means them: blue for the
 * thing you do, amber for the thing being written, green for the thing that
 * arrives finished.
 */
const POINTS = [
  {
    icon: Check,
    title: "One question",
    note: "Easy to answer",
    ring: "bg-active/10 text-active",
  },
  {
    icon: FileText,
    title: "Written scope",
    note: "Plain English",
    ring: "bg-amber/10 text-amber",
  },
  {
    icon: Clock,
    title: "Two working days",
    note: "Straight to your inbox",
    ring: "bg-done/10 text-done",
  },
] as const;

/**
 * The rings, as a share of the artwork.
 *
 * Percentages of the lockup rather than of the column or the window, so the
 * rings hold one relationship to the picture at every width. Measured off the
 * column they drifted: a wide window grew the column past the artwork's own cap
 * and the outer ring floated away from it.
 */
const RINGS = [58, 74, 90, 106, 122];

/**
 * The home page.
 *
 * One screenful and nothing under it: the claim, the standfirst, the two ways
 * in, and the artwork. `--stage` is the height of the window under the header,
 * set once in `globals.css`, so this cannot drift out of step with the header
 * when the header changes.
 *
 * The spacing down the left column is one ladder, 24 / 24 / 32 / 40, rather than
 * a value picked per block. Four steps that each read as bigger than the last is
 * what makes a column look set rather than assembled.
 *
 * A server component. There is nothing interactive on this page, so it ships no
 * JavaScript at all.
 */
export function Hero() {
  const at = SITE.tagline.indexOf(". ");
  const claim = at > -1 ? SITE.tagline.slice(0, at + 1) : SITE.tagline;
  const promise = at > -1 ? SITE.tagline.slice(at + 2) : "";

  return (
    <section className="page-frame relative isolate flex min-h-[var(--stage)] flex-col justify-center overflow-clip py-12 lg:py-10">
      <div className="grid max-w-wide items-center gap-x-12 gap-y-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] xl:gap-x-16">
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-bold tracking-[0.2em] text-label uppercase">
            Home
          </p>

          <h1 className="mt-6 max-w-[21ch] text-[clamp(34px,4.6vw,68px)] leading-[1.04] font-extrabold tracking-[-0.045em] text-ink">
            {claim}
            {promise ? (
              <span className="block text-active">{promise}</span>
            ) : null}
          </h1>

          <p className="mt-6 max-w-[58ch] text-[17px] leading-[1.6] text-body sm:text-[18px]">
            {SITE.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={ROUTES.build}
              className="inline-flex items-center rounded-field bg-active px-6 py-[13px] text-[15.5px] font-semibold text-white transition-opacity hover:opacity-90 sm:px-7 sm:py-[14px] sm:text-[16px]"
            >
              Build your website
            </Link>
            <Link
              href={ROUTES.book}
              className="inline-flex items-center rounded-field border border-ink bg-field px-6 py-[13px] text-[15.5px] font-semibold text-ink transition-colors hover:bg-ink hover:text-white sm:px-7 sm:py-[14px] sm:text-[16px]"
            >
              Book a meeting
            </Link>
          </div>

          {/* A grid rather than a wrapping row: three even columns keep the
              titles on one baseline, where flex-wrap left them stepping down as
              soon as one of them ran on. */}
          <ul className="mt-10 grid gap-x-6 gap-y-5 sm:grid-cols-3">
            {POINTS.map((point) => (
              <li key={point.title} className="flex min-w-0 items-center gap-3">
                <span
                  aria-hidden
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-pill",
                    point.ring,
                  )}
                >
                  <point.icon className="size-[18px]" strokeWidth={2.2} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[14.5px] leading-[1.3] font-semibold text-ink">
                    {point.title}
                  </span>
                  <span className="block text-[13px] leading-[1.35] text-quiet">
                    {point.note}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* One lockup: the artwork and the rings share a box, so they scale
            together. The box is what the column resizes, not the picture. */}
        <div className="mx-auto flex w-full max-w-[400px] justify-center lg:mx-0 lg:ml-auto lg:max-w-[520px] xl:max-w-[560px]">
          <div className="relative w-full">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10"
            >
              {RINGS.map((size, ring) => (
                <span
                  key={size}
                  style={{ width: `${size}%`, aspectRatio: "1" }}
                  className={cn(
                    "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-pill border",
                    ring < 2 ? "border-active/25" : "border-border",
                    /* The two widest are noise on a small screen, where they
                       are mostly cropped anyway. */
                    ring > 2 && "hidden sm:block",
                  )}
                />
              ))}
            </div>

            {/* `preload` rather than the deprecated `priority`, because this is
                the largest thing on the screen and must not be lazy loaded.
                `sizes` is what makes Next generate a width based srcset:
                without it the browser assumes the image is viewport wide and
                pulls a far larger file than this column ever needs. */}
            <Image
              src="/right-image.png"
              alt="A written scope headed 'Your answers become clarity', with three answers ticked off."
              width={999}
              height={999}
              preload
              sizes="(max-width: 640px) 88vw, (max-width: 1024px) 400px, 560px"
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
