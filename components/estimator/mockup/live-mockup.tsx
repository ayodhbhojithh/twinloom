"use client";

import { HOME_BLOCKS, OTHER_PAGES, WORK_UNDERNEATH } from "@/lib/scope";
import { cn } from "@/lib/utils";

import { MockupBlock } from "./mockup-block";
import { PageChip } from "./page-chip";
import { WorkChip } from "./work-chip";

/**
 * `rail` is the blueprint's narrow column, `stage` is the lanes layout where the
 * mock-up gets the room. The only difference is scale, driven by two CSS
 * variables, so one component serves both.
 */
export type MockupVariant = "rail" | "stage";

const SCALE: Record<MockupVariant, string> = {
  rail: "[--mock-unit:1.7px] [--page-h:62px] sm:[--mock-unit:2px] lg:[--mock-unit:1.05px] lg:[--page-h:54px] xl:[--mock-unit:1.25px]",
  stage:
    "[--mock-unit:1.7px] [--page-h:62px] sm:[--mock-unit:2.1px] lg:[--mock-unit:1.5px] lg:[--page-h:74px] xl:[--mock-unit:1.9px]",
};

interface LiveMockupProps {
  variant?: MockupVariant;
  label?: string;
  hint?: string;
  className?: string;
  frameClassName?: string;
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-3 font-mono text-[9.5px] font-semibold tracking-[0.12em] text-ink-5 uppercase">
      {children}
    </div>
  );
}

export function LiveMockup({
  variant = "rail",
  label = "Live mock-up, home",
  hint = "click a block to show it in the scope",
  className,
  frameClassName,
}: LiveMockupProps) {
  return (
    <div className={cn(SCALE[variant], className)}>
      <div className="flex items-baseline gap-2.5">
        <span className="font-mono text-[10px] font-semibold tracking-[0.14em] text-ink-5 uppercase">
          {label}
        </span>
        <span className="flex-1" />
        <span
          className={cn(
            "hidden text-right sm:block",
            variant === "rail"
              ? "font-script text-[16px] leading-none text-ink-5"
              : "text-[11.5px] text-ink-4",
          )}
        >
          {hint}
        </span>
      </div>

      <div
        className={cn(
          "mt-3 flex flex-col gap-1.5 rounded-inner border border-hairline-soft bg-sunken p-2.5",
          frameClassName,
        )}
      >
        {HOME_BLOCKS.map((block) => (
          <MockupBlock key={block.componentId} block={block} />
        ))}
      </div>

      <GroupLabel>Other pages</GroupLabel>
      <div className="mt-2 flex gap-2">
        {OTHER_PAGES.map((chip) => (
          <PageChip key={chip.componentId} chip={chip} />
        ))}
      </div>

      <GroupLabel>The work underneath</GroupLabel>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {WORK_UNDERNEATH.map((chip) => (
          <WorkChip key={chip.componentId} chip={chip} />
        ))}
      </div>
    </div>
  );
}
