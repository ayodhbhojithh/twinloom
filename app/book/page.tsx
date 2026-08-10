import { Suspense } from "react";
import type { Metadata } from "next";

import { BookingFlow } from "@/components/book/booking-flow";
import { frameworkMetadata } from "@/components/pages/framework-page";
import { ROUTES } from "@/lib/site";

export const metadata: Metadata = frameworkMetadata(ROUTES.book);

/**
 * Book a meeting.
 *
 * A length can be named in the address, because the scoping run asks the same
 * question before it sends and there is no reason to ask it twice. It is read
 * inside a boundary of its own: reading the address is a client's job, and
 * without one it would stop the whole page being rendered ahead of time.
 */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ mins?: string }>;
}) {
  const wanted = Number((await searchParams).mins);

  /* No `PageShell`. This screen is a tool rather than a document: it is the
     landing page's own composition - a line across the top, and one cut
     surface holding everything else for the rest of the window. A reading
     column with a section index beside it is the wrong shell for that. */
  return (
    <section className="flex min-h-[var(--stage)] flex-col justify-center overflow-clip py-10 max-sm:py-5">
      <Suspense>
        <BookingFlow wanted={Number.isFinite(wanted) ? wanted : undefined} />
      </Suspense>
    </section>
  );
}
