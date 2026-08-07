import type { Metadata } from "next";

import { PartnersView } from "@/components/pages/partners-view";
import { frameworkMetadata } from "@/components/pages/framework-page";
import { ROUTES } from "@/lib/site";

export const metadata: Metadata = frameworkMetadata(ROUTES.partners);

export default function Page() {
  return <PartnersView />;
}
