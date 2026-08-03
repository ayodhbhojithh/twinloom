import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/**
 * The merge, taught this site's own widths.
 *
 * `--container-measure` and `--container-wide` are ours, so out of the box the
 * merge does not know that `max-w-measure` and `max-w-[1400px]` are the same
 * property and keeps both. Whichever the stylesheet happens to emit last then
 * wins, which means a component passing a width to another component's
 * `className` silently does nothing: the override is there in the markup and
 * absent from the render. Naming them here puts both in the max-width group,
 * so the later class wins the way every other utility does.
 */
const merge = extendTailwindMerge({
  extend: { theme: { container: ["measure", "wide"] } },
})

export function cn(...inputs: ClassValue[]) {
  return merge(clsx(inputs))
}
