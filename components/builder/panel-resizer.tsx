"use client";

import { useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * The drag handle between a panel and the canvas.
 *
 * `setPointerCapture` rather than window listeners: once the pointer is captured
 * the element keeps receiving moves even when the cursor leaves it, so a fast drag
 * across the canvas does not slip out of the handle. It also means there is nothing
 * to unsubscribe, so a drag cannot outlive the component doing it.
 *
 * Also a real separator. `role="separator"` with arrow keys, because dragging is a
 * mouse gesture and a panel width that can only be set with a mouse is a panel
 * width some people cannot set. Home and End snap to the ends of the range.
 */
export function PanelResizer({
  side,
  width,
  min,
  max,
  onChange,
  className,
}: {
  side: "left" | "right";
  width: number;
  min: number;
  max: number;
  onChange: (width: number) => void;
  className?: string;
}) {
  const start = useRef({ x: 0, width: 0 });

  const clamp = (value: number) => Math.min(max, Math.max(min, value));

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={`Resize the ${side} panel`}
      aria-valuenow={width}
      aria-valuemin={min}
      aria-valuemax={max}
      tabIndex={0}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        start.current = { x: event.clientX, width };
      }}
      onPointerMove={(event) => {
        if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;

        const delta = event.clientX - start.current.x;
        onChange(
          clamp(side === "left" ? start.current.width + delta : start.current.width - delta),
        );
      }}
      onKeyDown={(event) => {
        const towards = side === "left" ? 1 : -1;

        if (event.key === "ArrowRight") onChange(clamp(width + 16 * towards));
        else if (event.key === "ArrowLeft") onChange(clamp(width - 16 * towards));
        else if (event.key === "Home") onChange(min);
        else if (event.key === "End") onChange(max);
        else return;

        event.preventDefault();
      }}
      className={cn(
        "group relative w-2 shrink-0 cursor-col-resize touch-none outline-none",
        className,
      )}
    >
      {/* The hit area is 8px wide and the mark inside it is 2px, which is the
          difference between something you can grab and something you can see. */}
      <span
        aria-hidden
        className="absolute inset-y-3 left-1/2 w-0.5 -translate-x-1/2 rounded-pill bg-transparent transition-colors duration-150 group-hover:bg-brand/40 group-focus-visible:bg-brand group-active:bg-brand"
      />
    </div>
  );
}
