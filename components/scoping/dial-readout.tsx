"use client";

import { Sparkles } from "lucide-react";

import { Rise } from "@/components/shared";
import { useThoughtsSession } from "@/components/thoughts";
import { effortRag, RAG_COLOUR, RAG_LABEL, STEP_COUNT } from "@/lib/scoping";

import { useScopingSession } from "./scoping-context";
import { StepIcon } from "./step-icon";

const LEGEND = [
  { rag: "todo", label: "Not set" },
  { rag: "light", label: "Light" },
  { rag: "medium", label: "Medium" },
  { rag: "heavy", label: "Heavy" },
] as const;

/**
 * What the dial is showing, in words.
 *
 * The dial is quick to read but says nothing precise; this names the section, its
 * effort, and every answer inside it. It reads from the same `sectionSummary` the
 * dial does, so the two are always the same claim twice.
 *
 * The captured line at the bottom closes the loop with the Thoughts panel. A
 * visitor who has already handed over files and colours should be told the journey
 * knows about them, rather than wondering whether that work counted.
 */
export function DialReadout() {
  const { index, step, summary } = useScopingSession();
  const { count, setOpen } = useThoughtsSession();

  const rag = summary.effort === null ? "todo" : effortRag(summary.effort);

  return (
    <div>
      <ul className="flex flex-wrap gap-x-3.5 gap-y-1.5">
        {LEGEND.map((entry) => (
          <li
            key={entry.rag}
            className="flex items-center gap-1.5 font-mono text-[9.5px] tracking-[0.04em] text-faint uppercase"
          >
            <span
              aria-hidden
              className="size-2 shrink-0 rounded-[2px]"
              style={{ background: RAG_COLOUR[entry.rag] }}
            />
            {entry.label}
          </li>
        ))}
      </ul>

      <Rise key={index} y={8} className="mt-4">
        <p className="font-mono text-[9.5px] font-bold tracking-[0.14em] text-faint uppercase tabular-nums">
          Readout · Section {index + 1} / {STEP_COUNT}
        </p>

        <div className="mt-2 flex items-center gap-3">
          <StepIcon icon={step.icon} at={index} />

          <div className="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1">
            <h2 className="text-[16px] font-extrabold tracking-[-0.01em] sm:text-[17px]">
              {step.kicker}
            </h2>

            <span
              className="rounded-nav px-1.5 py-0.5 font-mono text-[9px] font-extrabold tracking-[0.06em] text-white uppercase transition-colors duration-500"
              style={{ background: RAG_COLOUR[rag] }}
            >
              Effort {summary.effort === null ? "not set" : RAG_LABEL[rag]}
            </span>
          </div>
        </div>

        {summary.units.length ? (
          <dl className="mt-3 flex flex-col gap-1.5">
            {summary.units.map((unit) => (
              <div key={unit.label} className="text-[12.5px] leading-[1.5]">
                <dt className="inline font-bold">{unit.label}: </dt>
                <dd className="inline text-body">
                  {unit.options.map((option) => option.label).join(", ")}
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="mt-3 text-[12.5px] text-faint italic">
            Nothing answered here yet.
          </p>
        )}
      </Rise>

      {/* Held apart by space rather than by a rule. It belongs to the readout,
          it is just a different kind of fact about it. */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-6 flex w-full items-center gap-2 text-left transition-colors hover:text-ink"
      >
        <Sparkles aria-hidden className="size-3 shrink-0 text-accent-amber" />

        <span className="font-mono text-[9.5px] font-bold tracking-[0.12em] text-faint uppercase">
          Captured
        </span>

        <span className="font-mono text-[10.5px] text-faint">
          {count === 0
            ? "nothing added to your panel yet"
            : `${count} ${count === 1 ? "item" : "items"} in your panel`}
        </span>
      </button>
    </div>
  );
}
