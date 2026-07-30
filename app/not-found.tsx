import { NotFoundView } from "@/components/pages/not-found-view";

/**
 * Next's own 404 handler. Serves a 404 status and renders inside the root layout,
 * so the rail, the header and the footer come with it and a lost visitor still has
 * the whole site to hand.
 */
export default function NotFound() {
  return <NotFoundView />;
}
