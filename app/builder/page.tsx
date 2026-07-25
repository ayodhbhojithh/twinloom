import type { Metadata } from "next";

import { BuilderShell } from "@/components/builder";
import { SiteHeader } from "@/components/layout";

export const metadata: Metadata = {
  title: "Builder",
  description:
    "Build your website the way you want it. Compose it block by block on a live canvas and export React and Tailwind you can paste straight into a project.",
};

/**
 * The Builder route.
 *
 * No site footer here, and the shell is sized to the viewport minus the nav. A tool
 * is not a page: scrolling past a canvas to reach a footer is the wrong shape, and
 * the three columns need a fixed height to scroll inside independently.
 */
export default function BuilderPage() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <BuilderShell />
      </main>
    </>
  );
}
