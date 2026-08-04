import { Suspense } from "react";
import type { Metadata } from "next";

import { BookingFlow } from "@/components/book/booking-flow";
import { PageShell } from "@/components/layout";
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

  return (
    <PageShell>
      <Suspense>
        <BookingFlow wanted={Number.isFinite(wanted) ? wanted : undefined} />
      </Suspense>
    </PageShell>
  );
}
