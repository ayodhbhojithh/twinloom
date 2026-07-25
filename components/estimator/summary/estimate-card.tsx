"use client";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/content/site";
import { describeScope } from "@/lib/scope";
import { cn } from "@/lib/utils";

import { useScope } from "../scope-context";

/**
 * The blueprint layout's single estimate card. One figure, its range, the
 * package the total lands in and the timeline that comes with it.
 */
export function EstimateCard({ className }: { className?: string }) {
  const { totals } = useScope();
  const summary = describeScope(totals);

  return (
    <div
      className={cn(
        "rounded-card border border-hairline bg-surface px-5 py-5 shadow-[0_18px_40px_-28px_rgba(35,39,51,0.35)]",
        className,
      )}
    >
      <div className="font-mono text-[10px] font-semibold tracking-[0.14em] text-ink-5 uppercase">
        Your build, as ticked
      </div>

      <div className="mt-1.5 text-3xl font-extrabold tracking-[-0.02em] tabular-nums">
        {summary.total}
      </div>

      <p className="mt-0.5 text-[12.5px] text-ink-3">
        Indicative range <b className="tabular-nums">{summary.range}</b>,
        excluding VAT
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full border-[1.5px] border-brand/35 bg-brand-tint px-3 py-[5px] text-xs font-bold text-brand">
          {summary.tierName}
        </span>
        <span className="font-mono text-[10px] tracking-[0.08em] text-ink-5 uppercase">
          {summary.timeline}
        </span>
      </div>

      <div className="mt-3 font-mono text-[9.5px] leading-[1.6] tracking-[0.04em] text-ink-5">
        {summary.countLine}
      </div>

      <p className="mt-3 border-t border-dashed border-hairline pt-2.5 text-[11.5px] leading-[1.5] text-ink-4">
        {summary.careLine} Whatever is ticked becomes the &ldquo;what is
        included&rdquo; list in your plan.
      </p>

      <Button asChild size="lg" className="mt-4 h-11 w-full justify-center">
        <a href={SITE.bookingHref}>
          Book a 30 minute scope call
          <ArrowRight data-icon="inline-end" />
        </a>
      </Button>
    </div>
  );
}
