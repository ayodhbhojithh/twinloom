"use client";

/**
 * The per colour weight control.
 *
 * Still a native range input, because that is what gives keyboard and screen
 * reader users a real slider. Everything visible is ours: the track fills with
 * the colour being weighted, so the control reads as that colour's share.
 */
export function WeightSlider({
  id,
  hex,
  weight,
  label,
  onChange,
}: {
  id: string;
  hex: string;
  weight: number;
  label: string;
  onChange: (weight: number) => void;
}) {
  return (
    <input
      id={id}
      type="range"
      min={0}
      max={100}
      value={weight}
      aria-label={label}
      onChange={(event) => onChange(Number(event.target.value))}
      className="weight-slider min-w-0 flex-1"
      style={{
        /* currentColor drives the thumb's ring. */
        color: hex,
        background: `linear-gradient(to right, ${hex} 0%, ${hex} ${weight}%, var(--color-line) ${weight}%, var(--color-line) 100%)`,
      }}
    />
  );
}
