import type { Metadata } from "next";

import { SubProcessorsView } from "@/components/policy/sub-processors-view";
import { pageMeta } from "@/lib/seo";
import { ROUTES } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Sub-processors",
  description:
    "The providers that process personal data on our behalf, what each is used for, and where.",
  path: ROUTES.subProcessors,
});

export default function Page() {
  return <SubProcessorsView />;
}
