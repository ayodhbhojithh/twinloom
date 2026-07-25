"use client";

/**
 * The stop slider from turn 6a of the design canvas.
 *
 * A 6px rail, a gradient fill, five white stop marks along it, and an 18px white
 * thumb ringed in the fill's own colour. The stops are the point: they turn a
 * continuous drag into a decision between five recognisable positions, so nobody
 * has to wonder whether 7 means something different from 8.
 *
 * A real `<input type="range">` sits on top at zero opacity and does all the work.
 * Everything below it is `pointer-events-none` decoration. That buys keyboard
 * control, arrow key stepping, focus, ARIA and touch behaviour for free, none of
 * which a div rebuild would have got right.
 */
export function TickSlider({
  id,
  min,
  max,
  step = 1,
  value,
  colour,
  disabled,
  label,
  onChange,
}: {
  /** For a `<label htmlFor>` elsewhere. */
  id?: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  /** The fill and the thumb's ring. Usually the effort's RAG colour. */
  colour: string;
  disabled?: boolean;
  label: string;
  onChange: (value: number) => void;
}) {
  const filled = ((value - min) / (max - min)) * 100;

  /* Muted rather than transparent when off: the rail still has to read as a
     control you could pick up, not as a divider. */
  const fill = disabled
    ? "var(--color-line)"
    : `linear-gradient(90deg, ${colour}, color-mix(in oklab, ${colour} 62%, white))`;

  return (
    <div className="group relative h-[18px] w-full touch-none select-none">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-pill bg-[#e9edf2]"
      />

      <span
        aria-hidden
        style={{ width: `${filled}%`, background: fill }}
        className="pointer-events-none absolute top-1/2 left-0 h-1.5 -translate-y-1/2 rounded-pill transition-[width] duration-150"
      />

      {/* Five stops. White where the fill has reached them, grey where it has
          not, so the rail reports its own position twice over. */}
      {[20, 40, 60, 80, 100].map((at) => (
        <span
          key={at}
          aria-hidden
          style={{
            left: `${at}%`,
            background:
              !disabled && filled >= at ? "rgba(255,255,255,.85)" : "#cbd2de",
          }}
          className="pointer-events-none absolute top-1/2 h-[11px] w-[2.5px] -translate-x-1/2 -translate-y-1/2 rounded-[2px] transition-colors duration-150"
        />
      ))}

      <span
        aria-hidden
        style={{
          left: `${filled}%`,
          borderColor: disabled ? "#b4bbc6" : colour,
        }}
        /* The real input is invisible, so the focus ring has to be drawn here.
           `group-has-focus-visible` reads the input's state through the wrapper,
           which keeps the indicator on the thing that appears to move. */
        className="pointer-events-none absolute top-1/2 size-[18px] -translate-x-1/2 -translate-y-1/2 rounded-pill border-2 bg-white shadow-[0_3px_10px_-2px_rgba(35,39,51,0.4)] transition-[left,border-color] duration-150 group-has-focus-visible:ring-2 group-has-focus-visible:ring-brand/55 group-has-focus-visible:ring-offset-1"
      />

      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        aria-label={label}
        onChange={(event) => onChange(Number(event.target.value))}
        className="absolute inset-0 size-full cursor-grab opacity-0 active:cursor-grabbing disabled:cursor-not-allowed"
      />
    </div>
  );
}
