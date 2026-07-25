"use client";

import { effortRag, RAG_COLOUR, RAG_LABEL, STEP_COUNT } from "@/lib/scoping";

import { useScopingSession } from "./scoping-context";

const LEGEND = [
  { rag: "todo", label: "Not answered" },
  { rag: "light", label: "Light" },
  { rag: "medium", label: "Medium" },
  { rag: "heavy", label: "Heavy" },
] as const;

/**
 * What the dial is showing, in words.
 *
 * The dial is quick to read but says nothing precise; this names the section, its
 * effort, and every answer inside it. Reads from the same `sectionSummary` the
 * dial does, so the two are always the same claim twice.
 */
export function DialReadout() {
  const { index, step, summary } = useScopingSession();

  const rag = summary.effort === null ? "todo" : effortRag(summary.effort);

  return (
    <div>
      <ul className="flex flex-wrap gap-x-4 gap-y-2">
        {LEGEND.map((entry) => (
          <li
            key={entry.rag}
            className="flex items-center gap-1.5 text-[11px] text-body"
          >
            <span
              aria-hidden
              className="size-2.5 shrink-0 rounded-[3px]"
              style={{ background: RAG_COLOUR[entry.rag] }}
            />
            {entry.label}
          </li>
        ))}
      </ul>

      <p className="mt-5 font-mono text-[10px] font-bold tracking-[0.12em] text-faint uppercase">
        Readout · section {index + 1} of {STEP_COUNT}
      </p>

      <div className="mt-1.5 flex flex-wrap items-center gap-2.5">
        <h2 className="text-[17px] font-extrabold tracking-[-0.01em]">
          {step.kicker}
        </h2>

        <span
          className="rounded-nav px-2 py-0.5 font-mono text-[9.5px] font-extrabold tracking-[0.06em] text-white uppercase"
          style={{ background: RAG_COLOUR[rag] }}
        >
          Effort {RAG_LABEL[rag]}
        </span>
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
    </div>
  );
}
