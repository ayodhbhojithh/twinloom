"use client";

import { Rise } from "@/components/shared";
import { effortRag, RAG_COLOUR, RAG_LABEL } from "@/lib/scoping";

import { useScopingSession } from "./scoping-context";

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
 */
export function DialReadout() {
  const { index, step, summary } = useScopingSession();

  const rag = summary.effort === null ? "todo" : effortRag(summary.effort);

  return (
    <div>
      <ul className="flex flex-wrap gap-x-3 gap-y-1.5">
        {LEGEND.map((entry) => (
          <li
            key={entry.rag}
            className="flex items-center gap-1 font-mono text-[9.5px] tracking-[0.04em] text-faint uppercase"
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
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-[14.5px] font-extrabold tracking-[-0.01em]">
            {step.kicker}
          </h2>

          <span
            className="rounded-nav px-1.5 py-0.5 font-mono text-[9px] font-extrabold tracking-[0.06em] text-white uppercase transition-colors duration-500"
            style={{ background: RAG_COLOUR[rag] }}
          >
            {RAG_LABEL[rag]}
          </span>
        </div>

        {summary.units.length ? (
          <dl className="mt-2.5 flex flex-col gap-1.5">
            {summary.units.map((unit) => (
              <div key={unit.label} className="text-[12px] leading-[1.45]">
                <dt className="inline font-bold">{unit.label}: </dt>
                <dd className="inline text-body">
                  {unit.options.map((option) => option.label).join(", ")}
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="mt-2.5 text-[12px] text-faint italic">
            Nothing answered here yet.
          </p>
        )}
      </Rise>
    </div>
  );
}
