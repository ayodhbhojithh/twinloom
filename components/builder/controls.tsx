"use client";

import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   The inspector's vocabulary.

   Four widgets and nothing else: a labelled group, a row of segments, a row of
   swatches, and a stepper. Every property in the inspector is expressed with one
   of them, which is what keeps three tabs of controls readable. A one-off control
   for one property is how inspectors become junk drawers.
--------------------------------------------------------------------------- */

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <p className="font-mono text-[9px] font-bold tracking-[0.14em] text-faint uppercase">
          {label}
        </p>
        {hint ? (
          <p className="font-mono text-[9px] text-faint/80 tabular-nums">
            {hint}
          </p>
        ) : null}
      </div>

      <div className="mt-2">{children}</div>
    </div>
  );
}

/** One choice out of a few. Wraps, so a long scale does not overflow the panel. */
export function Segments<T extends string | number>({
  options,
  value,
  onChange,
  compact,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  compact?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {options.map((option) => {
        const on = option.value === value;

        return (
          <button
            key={String(option.value)}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={on}
            className={cn(
              "rounded-[6px] font-mono text-[9.5px] font-bold tracking-[0.06em] uppercase transition-colors",
              compact ? "min-w-7 px-1.5 py-1" : "px-2 py-1.5",
              on
                ? "bg-brand text-white"
                : "bg-panel-bg text-faint hover:text-ink",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/** Colours, as colours. A name for a fill is a worse control than the fill. */
export function Swatches({
  options,
  value,
  onChange,
}: {
  options: { value: string; css: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-1.5">
      {options.map((option) => {
        const on = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            title={option.label}
            aria-label={option.label}
            aria-pressed={on}
            style={{
              background:
                option.value === "none" ? "transparent" : option.css,
            }}
            className={cn(
              "h-7 rounded-[6px] transition-all",
              on
                ? "ring-2 ring-brand ring-offset-1"
                : "ring-1 ring-line ring-inset hover:ring-faint/60",
              option.value === "none" &&
                "bg-[repeating-conic-gradient(#e7eaf0_0%_25%,#ffffff_0%_50%)] bg-[length:10px_10px]",
            )}
          />
        );
      })}
    </div>
  );
}

/** A number on a scale, nudged rather than typed. */
export function Stepper({
  value,
  scale,
  onChange,
  label,
}: {
  value: number;
  scale: number[];
  onChange: (value: number) => void;
  label: string;
}) {
  const at = Math.max(0, scale.indexOf(value));

  const shift = (direction: -1 | 1) => {
    const next = scale[Math.min(scale.length - 1, Math.max(0, at + direction))];
    if (next !== undefined) onChange(next);
  };

  return (
    <div className="flex items-center gap-0.5 rounded-[6px] bg-panel-bg p-0.5">
      <button
        type="button"
        onClick={() => shift(-1)}
        aria-label={`Decrease ${label}`}
        className="flex size-5 items-center justify-center rounded-[4px] font-mono text-[11px] text-faint transition-colors hover:bg-white hover:text-ink"
      >
        &minus;
      </button>

      <span className="min-w-6 text-center font-mono text-[10px] font-bold tabular-nums">
        {value}
      </span>

      <button
        type="button"
        onClick={() => shift(1)}
        aria-label={`Increase ${label}`}
        className="flex size-5 items-center justify-center rounded-[4px] font-mono text-[11px] text-faint transition-colors hover:bg-white hover:text-ink"
      >
        +
      </button>
    </div>
  );
}

/** On or off, as a switch rather than a checkbox: it is a property, not an answer. */
export function Toggle({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: (on: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={cn(
        "relative h-5 w-9 shrink-0 rounded-full transition-colors",
        on ? "bg-brand" : "bg-line",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute top-0.5 size-4 rounded-full bg-white transition-transform duration-200",
          on ? "translate-x-[18px]" : "translate-x-0.5",
        )}
      />
    </button>
  );
}
