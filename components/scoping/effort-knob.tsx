"use client";

import {
  EFFORT_MAX,
  EFFORT_MIN,
  effortRag,
  RAG_COLOUR,
  RAG_LABEL,
} from "@/lib/scoping";
import { cn } from "@/lib/utils";

import { useScopingSession } from "./scoping-context";

/** The five stops, in effort. Turn 5a's dial board is built on five as well. */
const STOPS = [2, 4, 6, 8, 10] as const;

/** The sweep, in degrees, and where it starts. A 120 degree gap at the bottom. */
const SWEEP = 240;
const START = -120;

const angleFor = (value: number) =>
  START + (value / EFFORT_MAX) * SWEEP;

/**
 * The rotary effort knob, from turn 5a of the design canvas.
 *
 * A conic gradient masked into a ring, a dot on the rim for the needle, five stop
 * dots that light up in turn, and a white face showing the number. The whole thing
 * takes the colour of the effort it is showing, so turning it up walks the ring
 * from green through amber to red. The dial on the stage does exactly the same
 * thing with the same colours, which is the point: this is that dial's one
 * segment, made touchable.
 *
 * Why a knob and not a slider here. A slider says "somewhere on a line" and needs
 * a track wide enough to be honest about it; five of them stacked in a column read
 * as a form. A knob says "one of five positions" in a square, which is what these
 * areas actually are, and five of them read as a set of controls.
 *
 * Accessibility is the ARIA slider pattern rather than a hidden input: a range
 * input cannot be laid out as a circle without lying about where its thumb is. The
 * wrapper is focusable, takes arrow keys, Home and End, and reports its value. The
 * face steps and wraps on click, and each stop dot is a button of its own.
 */
export function EffortKnob({
  effortKey,
  value,
  label,
  className,
}: {
  effortKey: string;
  value: number;
  label: string;
  className?: string;
}) {
  const { setEffort } = useScopingSession();

  const rag = effortRag(value);

  /* Zero is off, not light. 6a calls it "not required" and greys the control out
     rather than colouring it green, which is the only reading that makes an empty
     ring look deliberate instead of broken. */
  const off = value === EFFORT_MIN;
  const colour = off ? "#b4bbc6" : RAG_COLOUR[rag];
  const swept = (value / EFFORT_MAX) * SWEEP;

  const set = (next: number) =>
    setEffort(effortKey, Math.min(EFFORT_MAX, Math.max(EFFORT_MIN, next)));

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label={`Effort for ${label}`}
      aria-valuemin={EFFORT_MIN}
      aria-valuemax={EFFORT_MAX}
      aria-valuenow={value}
      aria-valuetext={
        off ? "0, not required" : `${value} out of ${EFFORT_MAX}, ${RAG_LABEL[rag]}`
      }
      onKeyDown={(event) => {
        const keys: Record<string, number> = {
          ArrowRight: value + 1,
          ArrowUp: value + 1,
          ArrowLeft: value - 1,
          ArrowDown: value - 1,
          Home: EFFORT_MIN,
          End: EFFORT_MAX,
          PageUp: value + 2,
          PageDown: value - 2,
        };

        const next = keys[event.key];
        if (next === undefined) return;

        event.preventDefault();
        set(next);
      }}
      className={cn(
        "relative size-[96px] shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand/55 focus-visible:ring-offset-2",
        className,
      )}
    >
      {/* The ring. A conic gradient with a hole punched through it by a mask,
          which is the only way to get a variable arc without an SVG path. */}
      <span
        aria-hidden
        style={{
          background: `conic-gradient(from 240deg, ${colour}, color-mix(in oklab, ${colour} 58%, white) ${swept}deg, #e9edf2 ${swept}deg 240deg, transparent 240deg)`,
          WebkitMaskImage:
            "radial-gradient(closest-side, transparent 58%, #000 60%)",
          maskImage: "radial-gradient(closest-side, transparent 58%, #000 60%)",
          transition: "background .3s linear",
        }}
        className="absolute inset-[9px] rounded-full"
      />

      {/* Stop dots, outside the ring. Each is a button, so a level is one click
          away rather than a drag to the right spot. */}
      {STOPS.map((stop) => (
        <button
          key={stop}
          type="button"
          tabIndex={-1}
          aria-label={`Set effort for ${label} to ${stop}`}
          onClick={() => set(stop)}
          style={{
            background: value >= stop ? colour : "#cbd2de",
            transform: `translate(-50%, -50%) rotate(${angleFor(stop)}deg) translateY(-42px)`,
          }}
          className="absolute top-1/2 left-1/2 size-[9px] cursor-pointer rounded-full transition-colors duration-300 hover:opacity-80"
        />
      ))}

      {/* The needle rides the real value, so a default that sits between two
          stops is shown between them rather than snapped to one. */}
      <span
        aria-hidden
        style={{
          background: colour,
          transform: `translate(-50%, -50%) rotate(${angleFor(value)}deg) translateY(-20px)`,
          transition: "transform .25s cubic-bezier(.34,1.56,.64,1)",
        }}
        className="absolute top-1/2 left-1/2 size-[7px] rounded-full"
      />

      <button
        type="button"
        tabIndex={-1}
        aria-label={`Step effort for ${label}`}
        onClick={() => set(value >= EFFORT_MAX ? EFFORT_MIN : value + 2)}
        style={{ color: colour }}
        className="absolute inset-[18px] flex cursor-pointer items-center justify-center rounded-full bg-white ring-1 ring-line ring-inset font-mono text-[15px] font-semibold tabular-nums select-none"
      >
        {value}
      </button>
    </div>
  );
}
