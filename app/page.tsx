import type { Metadata } from "next";

import { Hero } from "@/components/home";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  /* `absolute` because the layout appends the company name to every title, and
     this one is the company name. */
  title: { absolute: SITE.name },
  description:
    "Tell us who your website is for and we write the rest down for you. One question, a written scope back within two working days, and no obligation.",
};

/**
 * Home.
 *
 * Not a `PageShell`. Every other screen here is a document, with a reading
 * measure, a section index and a previous/next pair at the foot of it. This one
 * is a single claim on a single screen, and it wants none of that furniture.
 *
 * Nothing under the fold either, and no footer: the whole page is the screen, so
 * anything below it would only be there to be scrolled past. `SiteShell` leaves
 * the footer off this route for that reason.
 */
export default function HomePage() {
  return <Hero />;
}
