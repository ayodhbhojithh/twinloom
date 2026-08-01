"use client";

import {
  Btn,
  EmptyPill,
  PROMISES,
  ROUTES,
  SITE,
  Stage,
} from "./shared";

/**
 * The claim, one line at a time.
 *
 * Each line sits on its own rule with an accent bar at the head of it, and the
 * bar grows line by line. It is the plainest possible picture of the offer: it
 * starts small, it fills up, and the last line is the one we do.
 */
const LINES: readonly {
  text: string;
  width: string;
  tone: string;
  accent?: boolean;
}[] = [
  { text: "Tell us who", width: "w-6", tone: "bg-planned" },
  { text: "your website is for.", width: "w-14", tone: "bg-planned" },
  { text: "We write the rest", width: "w-24", tone: "bg-active/45" },
  { text: "down for you.", width: "w-36", tone: "bg-active", accent: true },
];

/**
 * 08. Baseline.
 *
 * The tagline broken across four ruled lines, each one carrying a bar that gets
 * longer as the sentence goes on. The type is left exactly where it falls, and
 * the bars do all the drawing.
 *
 * The line breaks are set by hand, because where this sentence breaks is the
 * whole composition and not something to leave to the width of the window.
 */
export function V08Baseline() {
  return (
    <Stage className="justify-center py-8">
      <p className="font-mono text-[10px] font-bold tracking-[0.24em] text-label uppercase">
        Home
      </p>

      <h1 className="mt-8">
        {LINES.map((line) => (
          <span
            key={line.text}
            className="flex items-center gap-5 border-b border-hair py-2.5 last:border-b-0 sm:gap-8"
          >
            <span
              aria-hidden
              className={`h-1 shrink-0 rounded-pill ${line.width} ${line.tone}`}
            />
            <span
              className={`text-[clamp(28px,4.4vw,62px)] leading-[1.06] font-extrabold tracking-[-0.045em] ${
                line.accent ? "text-active" : "text-ink"
              }`}
            >
              {line.text}
            </span>
          </span>
        ))}
      </h1>

      <p className="mt-10 max-w-[52ch] text-[17px] leading-[1.55] text-body sm:text-[18.5px]">
        {SITE.description}
      </p>

      <div className="mt-9 flex flex-wrap items-center gap-3">
        <Btn href={ROUTES.build} variant="primary" size="large">
          Build your website
        </Btn>
        <Btn href={ROUTES.book} size="large">
          Book a meeting
        </Btn>
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-x-10 gap-y-4 pt-12">
        <ul className="flex flex-wrap items-center gap-x-8 gap-y-2">
          {PROMISES.map((promise, at) => (
            <li key={promise} className="flex items-center gap-3">
              {at > 0 ? (
                <span aria-hidden className="text-planned">
                  &middot;
                </span>
              ) : null}
              <span className="font-mono text-[10.5px] font-bold tracking-[0.16em] text-quiet uppercase">
                {promise}
              </span>
            </li>
          ))}
        </ul>

        <EmptyPill />
      </div>
    </Stage>
  );
}
