import type { Metadata } from "next";

import { NotFoundView } from "@/components/pages/not-found-view";

/**
 * A title of its own, and nothing else.
 *
 * No canonical: a 404 has no address worth declaring, and the one it would
 * otherwise inherit is the home page's - which is how every missing URL on a
 * site ends up telling Google it is a copy of the front door.
 *
 * No `robots` either. Next injects `noindex` for anything returning a 404
 * status, and a second robots tag written here would only be a chance to
 * contradict it.
 */
export const metadata: Metadata = {
  title: "Page not found",
  description:
    "The page is not here. What the site does have is on every other screen.",
};

/**
 * Next's own 404 handler. Serves a 404 status and renders inside the root layout,
 * so the rail, the header and the footer come with it and a lost visitor still has
 * the whole site to hand.
 */
export default function NotFound() {
  return <NotFoundView />;
}
