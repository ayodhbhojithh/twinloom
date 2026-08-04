import { PageMeta } from "@/components/blocks/page-meta";
import { PageShell } from "@/components/layout";

import { BuildFlow } from "./v5/flow";

/**
 * Build your website.
 *
 * The header speaks the landing page's language: one extrabold line with the
 * ask in ink and the promise behind it in quiet, and nothing else. Everything
 * that used to be explained here is now said by the tool itself, one step at a
 * time, which is where somebody answering can actually use it.
 */
export function BuildView() {
  return (
    <PageShell>
      <h1 className="mb-7 max-w-[30ch] text-[clamp(28px,2.8vw,44px)] leading-[1.06] font-extrabold tracking-[-0.04em] text-ink">
        Build your website.
        <span className="text-quiet"> Answer what you like - we write it down.</span>
      </h1>

      <BuildFlow />

      <PageMeta
        values={{
          title: "Build your website",
          description:
            "Two ways through: say it in your own words and send it, or work through twelve steps and read the whole thing back. Nothing is priced, nothing is scored, and you can stop at any step.",
        }}
      />
    </PageShell>
  );
}
