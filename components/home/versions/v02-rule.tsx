"use client";

import {
  Btn,
  EmptyPill,
  PROMISES,
  ROUTES,
  SITE,
  Stage,
  splitTagline,
} from "./shared";

/**
 * 02. Rule.
 *
 * One heavy vertical rule running the height of the screen, with the company
 * name set along it and everything else hanging off it. The rule is the
 * masthead: it gives the page a spine and it puts the name somewhere it can be
 * read without taking a line of its own.
 *
 * The rotated label is `writing-mode` rather than a transform, so it still wraps
 * and still reads as text to anything that has to.
 */
export function V02Rule() {
  const { claim, promise } = splitTagline();

  return (
    <Stage className="py-8">
      <div className="flex min-h-0 flex-1 gap-8 sm:gap-12">
        <div className="flex shrink-0 items-start gap-4 sm:gap-6">
          <p
            className="font-mono text-[10px] font-bold tracking-[0.24em] text-label uppercase [writing-mode:vertical-rl]"
            style={{ transform: "rotate(180deg)" }}
          >
            The Very Good Website Company
          </p>
          <span aria-hidden className="w-0.5 self-stretch bg-ink" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <h1 className="max-w-[17ch] text-[clamp(34px,5.4vw,80px)] leading-[1.0] font-extrabold tracking-[-0.048em] text-ink">
            {claim}
            <span className="block text-active">{promise}</span>
          </h1>

          <p className="mt-8 max-w-[50ch] text-[17px] leading-[1.55] text-body sm:text-[19px]">
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

          <div className="mt-auto flex flex-wrap items-center justify-between gap-x-10 gap-y-4 border-t border-border pt-6">
            <ul className="flex flex-wrap items-baseline gap-x-9 gap-y-2">
              {PROMISES.map((promise, at) => (
                <li key={promise} className="flex items-baseline gap-2.5">
                  <span className="font-mono text-[10.5px] font-bold text-idx tabular-nums">
                    {String(at + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[15.5px] font-semibold text-ink">
                    {promise}
                  </span>
                </li>
              ))}
            </ul>

            <EmptyPill />
          </div>
        </div>
      </div>
    </Stage>
  );
}
