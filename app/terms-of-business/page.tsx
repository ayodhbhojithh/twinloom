import type { Metadata } from "next";

import { TermsOfBusinessView } from "@/components/policy/terms-of-business-view";
import { pageMeta } from "@/lib/seo";
import { ROUTES } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Terms of Business",
  description:
    "The standard commercial terms for a client engagement, which apply alongside an accepted proposal. Twenty-five clauses, from scope and fees to exit and handover.",
  path: ROUTES.termsOfBusiness,
});

export default function Page() {
  return <TermsOfBusinessView />;
}
