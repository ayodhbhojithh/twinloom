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
 * The home page.
 *
 * One screenful and nothing under it: the claim, the standfirst, the two ways
 * in, and the artwork. `--stage` is the height of the window under the header,
 * set once in `globals.css`, so this cannot drift out of step with the header
 * when the header changes.
 *
 * Concentric outlines spread from behind the artwork rather than behind the
 * type, so the rings frame the picture. They are sized as a percentage of their
 * own column instead of the window, so they hold their relationship to the
 * artwork at every width rather than swallowing it on a wide screen.
 *
 * A server component. There is nothing interactive on this page, so it ships no
 * JavaScript at all.
 */
export function Hero() {
  const at = SITE.tagline.indexOf(". ");
  const claim = at > -1 ? SITE.tagline.slice(0, at + 1) : SITE.tagline;
  const promise = at > -1 ? SITE.tagline.slice(at + 2) : "";

  return (
    <section className="page-frame relative isolate flex min-h-[var(--stage)] flex-col justify-center overflow-clip py-10">
      <div className="grid max-w-wide items-center gap-x-12 gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,46%)]">
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-bold tracking-[0.2em] text-label uppercase">
            Home
          </p>

          <h1 className="mt-6 max-w-[15ch] text-[clamp(34px,4.6vw,68px)] leading-[1.02] font-extrabold tracking-[-0.048em] text-ink">
            {claim}
            {promise ? <span className="block text-active">{promise}</span> : null}
          </h1>

          <p className="mt-7 max-w-[48ch] text-[16.5px] leading-[1.6] text-body sm:text-[17.5px]">
            {SITE.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={ROUTES.build}
              className="inline-flex items-center rounded-field bg-active px-7 py-[14px] text-[16px] font-semibold text-white transition-opacity hover:opacity-90"
            >
              Build your website
            </Link>
            <Link
              href={ROUTES.book}
              className="inline-flex items-center rounded-field border border-ink bg-field px-7 py-[14px] text-[16px] font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
            >
              Book a meeting
            </Link>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-10 gap-y-5">
            {POINTS.map((point) => (
              <li key={point.title} className="flex items-center gap-3">
                <span
                  aria-hidden
                  className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-pill",
                    point.ring,
                  )}
                >
                  <point.icon className="size-5" strokeWidth={2.2} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[15px] leading-[1.3] font-semibold text-ink">
                    {point.title}
                  </span>
                  <span className="block text-[13.5px] leading-[1.35] text-quiet">
                    {point.note}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex min-w-0 items-center justify-center">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            {[62, 78, 94, 110, 126].map((size, ring) => (
              <span
                key={size}
                style={{ width: `${size}%`, aspectRatio: "1" }}
                className={cn(
                  "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-pill border",
                  ring < 2 ? "border-active/25" : "border-border",
                )}
              />
            ))}
          </div>

          {/* `preload` rather than the deprecated `priority`, because this is
              the largest thing on the screen and must not be lazy loaded.
              `sizes` is what makes Next generate a width based srcset: without
              it the browser assumes the image is viewport wide and pulls a far
              larger file than this column ever needs. */}
          <Image
            src="/right-image.png"
            alt="A written scope headed 'Your answers become clarity', with three answers ticked off."
            width={999}
            height={999}
            preload
            sizes="(max-width: 1024px) 88vw, 44vw"
            className="h-auto w-full max-w-[560px]"
          />
        </div>
      </div>
    </section>
  );
}
