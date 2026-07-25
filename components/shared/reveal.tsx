"use client";

import { motion, useReducedMotion, type Transition } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * A spring, not an ease.
 *
 * A cubic bezier arrives at its end point and stops dead. A spring decelerates
 * into it, which is what reads as smooth. Slightly overdamped on purpose: no
 * visible bounce, just a soft landing.
 */
const SPRING: Transition = {
  type: "spring",
  stiffness: 90,
  damping: 20,
  mass: 0.9,
};

/** How far each item in a group trails the one before it, in seconds. */
const STAGGER = 0.07;

/**
 * A reveal wraps the thing it animates, so it has to be able to *be* that thing:
 * an `li` inside a list, a `figure` around a quote. A `div` in either place would
 * be invalid markup.
 */
type RevealElement = "div" | "li" | "figure";

const TAGS = {
  div: motion.div,
  li: motion.li,
  figure: motion.figure,
} as const;

export interface RevealProps {
  as?: RevealElement;
  /** Position in a group. Sets the delay, so a grid arrives in sequence. */
  index?: number;
  /** Extra delay in seconds, on top of the index. */
  delay?: number;
  /** How far it travels in. Negative comes down from above. */
  y?: number;
  className?: string;
  children: React.ReactNode;
}

/**
 * Reveals its children as they scroll into view, once.
 *
 * `whileInView` with `once` rather than a scroll-linked animation: the element
 * plays a spring on entry and is then left alone, so nothing recomputes while
 * scrolling past it.
 *
 * `useReducedMotion` short circuits to a plain element. That matters more here
 * than a CSS media query would: motion applies the transform inline, so the only
 * honest way to respect the preference is not to animate at all.
 */
export function Reveal({
  as = "div",
  index = 0,
  delay = 0,
  y = 18,
  className,
  children,
}: RevealProps) {
  const reduced = useReducedMotion();
  const Tag = TAGS[as];

  if (reduced) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Tag
      data-reveal
      className={cn(className)}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -8% 0px" }}
      transition={{ ...SPRING, delay: delay + index * STAGGER }}
    >
      {children}
    </Tag>
  );
}

/**
 * The same spring, on load rather than on scroll. For anything above the fold,
 * where "scrolls into view" has already happened before the page is interactive.
 */
export function Rise({
  as = "div",
  index = 0,
  delay = 0,
  y = 16,
  className,
  children,
}: RevealProps) {
  const reduced = useReducedMotion();
  const Tag = TAGS[as];

  if (reduced) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Tag
      data-reveal
      className={cn(className)}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SPRING, delay: delay + index * STAGGER }}
    >
      {children}
    </Tag>
  );
}
