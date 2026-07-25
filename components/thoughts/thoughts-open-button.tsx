"use client";

import { Sparkles } from "lucide-react";

import { ActionButton } from "@/components/shared";

import { useThoughtsSession } from "./thoughts-context";

/**
 * Opens the Thoughts panel from anywhere on the page.
 *
 * The third door in the hero: some visitors would rather hand over a brief, a
 * screenshot and their colours than answer questions, and the panel is where
 * that goes.
 */
export function ThoughtsOpenButton({
  size = "lg",
  className,
}: {
  size?: "sm" | "default" | "lg";
  className?: string;
}) {
  const { setOpen } = useThoughtsSession();

  return (
    <ActionButton
      variant="secondary"
      size={size}
      className={className}
      onClick={() => setOpen(true)}
    >
      <Sparkles aria-hidden className="size-4 text-brand" />
      Thoughts &amp; inspiration
    </ActionButton>
  );
}
