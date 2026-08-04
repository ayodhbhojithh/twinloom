"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   The small pieces every step is made of.

   The prototype gives each of these a two-letter class and uses it forty times.
   Here they are components, so a change to what a "layer mark" or an
   "underneath note" looks like happens once rather than in every step that has
   one, and a step file reads as what it says rather than as how it is drawn.
--------------------------------------------------------------------------- */

/** The mono label the prototype puts above a group of answers. */
export function Kicker({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-mono text-[10.5px] font-bold tracking-[0.16em] text-label uppercase",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Which layer of the question this is: the prototype's `.lay`. */
export function LayerMark({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-5">
      <Kicker>{children}</Kicker>
    </p>
  );
}

/** A heading inside a step, with its note under it: `.sh4` and `.sh4n`. */
export function SubHead({
  title,
  note,
  className,
}: {
  title: string;
  note?: string;
  className?: string;
}) {
  return (
    <div className={cn("mt-9 mb-4", className)}>
      <h4 className="text-[19px] leading-[1.25] font-bold tracking-[-0.015em] text-ink sm:text-[21px]">
        {title}
      </h4>
      {note ? (
        <p className="mt-1.5 max-w-measure text-[15px] leading-[1.55] text-quiet">
          {note}
        </p>
      ) : null}
    </div>
  );
}

/**
 * A note set underneath an answer: the prototype's `.und`.
 *
 * Quieter than the copy above it and never a box, because it is a footnote to
 * the question rather than a second question.
 */
export function Under({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 max-w-measure text-[15px] leading-[1.6] text-quiet [&>b]:font-semibold [&>b]:text-ink">
      {children}
    </p>
  );
}

/** A filled aside with a label: the prototype's `.build` and `.stback`. */
export function Aside({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(
        "mt-6 max-w-measure rounded-card border border-border bg-well p-5",
        className,
      )}>
      <Kicker className="mb-2.5 block">{label}</Kicker>
      <div className="text-[15px] leading-[1.6] text-quiet [&>*:last-child]:mb-0 [&>p]:mb-3 [&_b]:font-semibold [&_b]:text-ink">
        {children}
      </div>
    </div>
  );
}

/**
 * What this step needs before you can stop at it: the prototype's `.stop`.
 *
 * On every step, and on most of them the answer is "nothing". That is the
 * point of printing it: a run-through you can leave at any moment has to say
 * so at the moment you might want to leave.
 */
export function StopNote({ needs }: { needs: string }) {
  return (
    <p className="mt-8 text-[14.5px] leading-[1.6] text-quiet">
      You can stop at this step and send what you have. What this one needs
      before you can: <b className="font-semibold text-ink">{needs}</b>
    </p>
  );
}

/** A tick in a disc, for a thing that is already true rather than choosable. */
export function TickMark({ on }: { on?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-[22px] flex-none items-center justify-center rounded-pill transition-colors",
        on ? "bg-ink text-white" : "bg-field text-planned",
      )}
    >
      <Check className="size-[13px]" strokeWidth={3} />
    </span>
  );
}

/**
 * One answer inside a question: the prototype's `.kch` chip.
 *
 * Filled when chosen rather than outlined, which is the rule the rest of this
 * site settled on: on a monochrome screen a fill is the only signal that reads
 * at a glance across a row of twenty.
 */
export function Chip({
  on,
  onClick,
  title,
  children,
}: {
  on: boolean;
  onClick: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      title={title}
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-pill px-3.5 py-2 text-[13.5px] font-semibold transition-colors",
        on
          ? "bg-done text-white"
          : "bg-planned text-body hover:bg-border hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

/** A row of chips, with the question above them. */
export function ChipRow({
  label,
  note,
  children,
}: {
  label?: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-5">
      {label ? (
        <p className="mb-1 text-[15px] font-semibold text-ink">{label}</p>
      ) : null}
      {note ? (
        <p className="mb-2.5 max-w-measure text-[14px] leading-[1.5] text-quiet">
          {note}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

/** A written answer. Grows with what is typed rather than scrolling inside. */
export function WriteIn({
  id,
  label,
  note,
  placeholder,
  value,
  onChange,
  rows = 4,
}: {
  id: string;
  label?: string;
  note?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <div className="mt-5 max-w-measure">
      {label ? (
        <label
          htmlFor={id}
          className="mb-1 block text-[15px] font-semibold text-ink"
        >
          {label}
        </label>
      ) : null}
      {note ? (
        <p className="mb-2.5 text-[14px] leading-[1.5] text-quiet">{note}</p>
      ) : null}
      <textarea
        id={id}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full resize-y rounded-card bg-well px-4 py-3.5 text-[15px] leading-[1.6] text-ink outline-none transition-colors placeholder:text-label focus:bg-hair"
      />
    </div>
  );
}
