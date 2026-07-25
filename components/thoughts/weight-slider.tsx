"use client";

import { TickSlider } from "@/components/shared";

/**
 * The per colour weight control.
 *
 * The same stop slider the scoping journey uses, filled with the colour being
 * weighted so the control reads as that colour's share. One slider mechanism
 * across the whole site: a second one would only teach people to look twice.
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
    <div className="min-w-0 flex-1">
      <TickSlider
        id={id}
        min={0}
        max={100}
        value={weight}
        colour={hex}
        label={label}
        onChange={onChange}
      />
    </div>
  );
}
