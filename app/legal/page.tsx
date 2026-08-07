import type { Metadata } from "next";

import { LegalView } from "@/components/policy/legal-view";
import { pageMeta } from "@/lib/seo";
import { ROUTES } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Legal",
  description:
    "TwinLoom is a trading name of TwinCoreTech Ltd. The company details, and the seven documents that govern this website, your personal information and a client engagement.",
  path: ROUTES.legal,
});

export default function Page() {
  return <LegalView />;
}
