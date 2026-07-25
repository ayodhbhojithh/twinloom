"use client";

import { effortRag, RAG_COLOUR, RAG_LABEL, STEP_COUNT } from "@/lib/scoping";

const RADIUS = 15;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

import { useScopingSession } from "./scoping-context";

/**
 * The orientation strip below the panel breakpoint.
 *
 * The full dial is the right centrepiece on a wide screen and a waste of a phone
 * screen: it would push the first question below the fold every time. This keeps
 * what matters while scrolling, in one line, pinned under the nav.
 */
export function MiniProgress() {
  const { step, index, percent, overall } = useScopingSession();

  const rag = overall === null ? "todo" : effortRag(overall);

  return (
    <div className="sticky top-[var(--nav-height)] z-30 border-b border-line bg-bg/95 backdrop-blur lg:hidden">
      <div className="mx-auto flex w-full max-w-wide items-center gap-3 px-5 py-2.5 sm:px-[22px]">
        <svg
          viewBox="0 0 36 36"
          className="size-9 shrink-0 -rotate-90"
          role="img"
          aria-label={`${percent} percent complete`}
        >
          <circle
            cx="18"
            cy="18"
            r={RADIUS}
            fill="none"
            stroke="var(--color-line)"
            strokeWidth={3}
          />
          <circle
            cx="18"
            cy="18"
            r={RADIUS}
            fill="none"
            stroke="var(--color-brand)"
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - percent / 100)}
            className="transition-[stroke-dashoffset] duration-700 ease-[var(--ease-out-soft)]"
          />
        </svg>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-bold">{step.kicker}</p>
          <p className="font-mono text-[10px] tracking-[0.06em] text-faint uppercase tabular-nums">
            Step {index + 1} of {STEP_COUNT} · {percent}%
          </p>
        </div>

        <span
          className="shrink-0 rounded-nav px-2 py-0.5 font-mono text-[9px] font-extrabold tracking-[0.06em] text-white uppercase transition-colors duration-500"
          style={{ background: RAG_COLOUR[rag] }}
        >
          {RAG_LABEL[rag]}
        </span>
      </div>
    </div>
  );
}
