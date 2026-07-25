"use client";

import { describeScope, sectionLines } from "@/lib/scope";
import { cn } from "@/lib/utils";

import { useScope } from "../scope-context";
import { EstimateRequestForm } from "./estimate-request-form";

/**
 * The estimate, in the prototype's card: a live badge, the range as the headline
 * figure, the section subtotals as line items, then the caveat that keeps this a
 * pre estimate rather than a quote.
 */
export function EstimateCard({ className }: { className?: string }) {
  const { totals } = useScope();
  const summary = describeScope(totals);
  const lines = sectionLines(totals);

  return (
    <div
      className={cn(
        "rounded-card border border-hairline bg-surface p-5 shadow-estimate sm:p-6",
        className,
      )}
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-mono text-[11px] font-semibold tracking-[0.14em] text-mono uppercase">
          Your estimate
        </span>
        <span className="font-mono text-[11px] tracking-[0.1em] text-live tabular-nums">
          ● live · {totals.optionsTicked} items
        </span>
      </div>

      <div className="mt-3 text-[30px] font-extrabold tracking-[-0.02em] tabular-nums sm:text-[38px]">
        {summary.range}
      </div>

      <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1">
        <span className="rounded-full border border-brand-edge bg-brand-tint px-2.5 py-[3px] font-mono text-[10px] font-semibold tracking-[0.1em] text-brand uppercase">
          {summary.tierName}
        </span>
        <span className="font-mono text-[11.5px] text-mono">
          {summary.timeline} · {summary.total} ticked
        </span>
      </div>

      <dl className="mt-4 font-mono text-[12.5px]">
        {lines.map((line) => (
          <div
            key={line.id}
            className="flex items-baseline justify-between gap-3.5 border-t border-hairline-soft py-2"
          >
            <dt className="flex min-w-0 items-center gap-2 text-ink-3">
              <span
                aria-hidden
                className="size-1.5 shrink-0 rounded-full"
                style={{
                  background: line.included ? line.accent : "var(--color-tick-border)",
                }}
              />
              <span className="truncate">{line.name}</span>
            </dt>
            <dd
              className={cn(
                "shrink-0 tabular-nums",
                line.included ? "text-ink" : "text-ink-5",
              )}
            >
              {line.value}
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-3 font-mono text-[10.5px] leading-[1.6] tracking-[0.04em] text-ink-5">
        a guide, not a contract · fixed quote confirmed on a call · ex vat
      </p>

      <p className="mt-2 text-[11.5px] leading-[1.5] text-ink-4">
        {summary.careLine}
      </p>

      <EstimateRequestForm />
    </div>
  );
}
