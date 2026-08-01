import type { Metadata } from "next";

import {
  FrameworkPageView,
  frameworkMetadata,
} from "@/components/pages/framework-page";
import { ROUTES } from "@/lib/site";

export const metadata: Metadata = frameworkMetadata(ROUTES.contact);

export default function Page() {
  return <FrameworkPageView href={ROUTES.contact} />;
}
