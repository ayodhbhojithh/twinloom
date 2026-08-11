import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

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
});

export function cn(...inputs: ClassValue[]) {
  return merge(clsx(inputs));
}

/**
 * Following a link to the page you are already standing on.
 *
 * The nav points at pages, and one of those pages has sections in it: the
 * landing page carries `#services` and `#build`, and the bar links straight into
 * them. So somebody reading the services section is at `/#services`, and the
 * `Home` beside it points at `/` - the same page, four screenfuls up.
 *
 * A router has nothing to do there. The pathname is identical, so the navigation
 * is a no-op: nothing is fetched, nothing is rendered, and the window stays
 * exactly where it was. What that looks like is a link that does not work, which
 * is worse than one that is missing - it was pressed, and the page ignored it.
 *
 * `same` is the caller's own test for whether the destination is the current
 * page - each of them has already worked it out to mark the row - and where it
 * is true this takes the click: the fragment comes off the address so the next
 * reload does not jump back down, and the window goes to the top.
 *
 * `replaceState` rather than a push, because going to the top of the page you
 * are on is not a place in the history. Pressing back afterwards should leave
 * the page, not put the hash back on.
 */
export function toTop(event: { preventDefault: () => void }, same: boolean) {
  if (!same) return;

  event.preventDefault();

  if (window.location.hash) {
    window.history.replaceState(null, "", window.location.pathname);
  }

  window.scrollTo({
    top: 0,
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth",
  });
}
