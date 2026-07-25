"use client";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/content/site";
import { describeScope } from "@/lib/scope";
import { cn } from "@/lib/utils";

import { useScope } from "../scope-context";

function StatCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-inner border border-hairline bg-surface p-4 shadow-[0_1px_3px_rgba(31,36,48,0.05)]">
      <div className="font-mono text-[10px] font-semibold tracking-[0.14em] text-ink-5 uppercase">
        {label}
      </div>
      {children}
    </div>
  );
}

/**
 * The lanes layout keeps the numbers in a slim column of their own, split across
 * three cards so the mock-up can hold centre stage. Below that column's
 * breakpoint the three cards spread across a row instead of stacking.
 */
export function EstimateStack({ className }: { className?: string }) {
  const { totals } = useScope();
  const summary = describeScope(totals);

  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      <div className="grid gap-2.5 sm:grid-cols-3 xl:grid-cols-1">
        <StatCard label="Estimate">
          <div className="mt-1 text-[26px] font-extrabold tracking-[-0.02em] tabular-nums">
            {summary.total}
          </div>
          <p className="mt-0.5 text-[11.5px] text-ink-3">
            Range <b className="tabular-nums">{summary.range}</b>
          </p>
          <p className="mt-0.5 text-[10.5px] text-ink-4">
            Indicative, excluding VAT
          </p>
        </StatCard>

        <StatCard label="Suggested package">
          <div className="mt-1 text-[15px] font-extrabold">
            {summary.tierName}
          </div>
          <p className="mt-px text-[11.5px] text-ink-3">{summary.timeline}</p>
        </StatCard>

        <StatCard label="In the build">
          <p className="mt-1.5 text-[11.5px] leading-[1.5] text-ink-3">
            {summary.countLine}
          </p>
        </StatCard>
      </div>

      <p className="px-1 text-[10.5px] leading-[1.5] text-ink-4">
        {summary.careLine}
      </p>

      <Button asChild size="lg" className="h-11 w-full justify-center">
        <a href={SITE.bookingHref}>
          Book a scope call
          <ArrowRight data-icon="inline-end" />
        </a>
      </Button>
    </div>
  );
}
