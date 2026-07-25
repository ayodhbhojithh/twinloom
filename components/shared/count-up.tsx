"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  motion,
} from "motion/react";

/**
 * A number that counts up to itself the first time it is seen.
 *
 * The point is not the animation, it is that the figure looks *derived*. A score
 * that arrives already at 74 could have been typed; one that runs up to 74 reads as
 * the output of something, which is exactly what everything on the Blueprint is.
 *
 * Driven by a `MotionValue` rendered straight into the span rather than by React
 * state, so counting sixty frames does not cost sixty renders of the page around it.
 */
export function CountUp({
  to,
  duration = 0.9,
  className,
}: {
  to: number;
  duration?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  const value = useMotionValue(0);
  const shown = useTransform(value, (current) => Math.round(current));

  useEffect(() => {
    if (reduced) {
      value.set(to);
      return;
    }

    if (!inView) return;

    const controls = animate(value, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
    });

    return () => controls.stop();
  }, [inView, reduced, to, duration, value]);

  return (
    <motion.span ref={ref} className={className}>
      {shown}
    </motion.span>
  );
}

/**
 * A bar that grows to its share once it scrolls into view.
 *
 * Same reasoning as the number beside it: a bar already at 38% is a graphic, a bar
 * that runs out to 38% is a measurement.
 */
export function GrowBar({
  percent,
  className,
  trackClassName,
}: {
  percent: number;
  className?: string;
  trackClassName?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <div
      aria-hidden
      className={`h-[3px] overflow-hidden rounded-pill bg-line ${trackClassName ?? ""}`}
    >
      <motion.div
        className={`h-full rounded-pill ${className ?? "bg-brand"}`}
        initial={reduced ? false : { width: 0 }}
        whileInView={{ width: `${percent}%` }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={reduced ? { width: `${percent}%` } : undefined}
      />
    </div>
  );
}
