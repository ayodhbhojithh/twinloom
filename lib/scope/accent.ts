import type { CSSProperties } from "react";

/**
 * Section accents are data, so they cannot be Tailwind class names. Each row
 * publishes its accent as CSS variables and the utilities read them back with
 * `bg-[var(--scope-tint)]` and friends.
 *
 * The `scope-` prefix matters: shadcn already owns `--accent`, so an unprefixed
 * variable would quietly repaint any shadcn component rendered inside a section.
 *
 * The alpha suffixes match the prototype, where the same hex was concatenated
 * with 0A, 12, 26 and 44.
 */
export function accentVars(accent: string): CSSProperties {
  return {
    "--scope-accent": accent,
    "--scope-wash": `${accent}0a`,
    "--scope-tint": `${accent}12`,
    "--scope-ring": `${accent}26`,
    "--scope-edge": `${accent}44`,
  } as CSSProperties;
}
