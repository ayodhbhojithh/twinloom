import type { Metadata } from "next";

import { ComplaintsView } from "@/components/policy/complaints-view";
import { pageMeta } from "@/lib/seo";
import { ROUTES } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Complaints and data requests",
  description:
    "How to raise a complaint or a personal-data request with TwinCoreTech Ltd, and when to expect a response.",
  path: ROUTES.complaints,
});

export default function Page() {
  return <ComplaintsView />;
}
