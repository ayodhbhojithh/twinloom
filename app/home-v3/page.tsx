import type { Metadata } from "next";

import { EmptyHome } from "@/components/home/empty-home";

export const metadata: Metadata = {
  title: "Home v3",
  description:
    "A third look at the home page. Nothing in here yet.",
};

export default function HomeV3Page() {
  return <EmptyHome label="Home v3" />;
}
