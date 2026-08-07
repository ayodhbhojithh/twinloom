import type { Metadata } from "next";

import { ServicesView } from "@/components/pages/services-view";
import { pageMeta } from "@/lib/seo";
import { ROUTES } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Our services",
  description:
    "Websites and the custom software behind them, plus digital consultancy, ongoing services, brand identity and campaign management. All of it on one contract, from us.",
  path: ROUTES.services,
});

export default function Page() {
  return <ServicesView />;
}
