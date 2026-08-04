import { PageShell } from "@/components/layout";

import { BuildFlow } from "./v5/flow";

/**
 * Build your website.
 *
 * Only the frame. The heading belongs to the tool rather than to the page,
 * because it shares a row with the choice of route and the two have to be laid
 * out together - the landing page arranges its own hero the same way, headline
 * on the left and the way in on the right.
 *
 * Everything that used to be explained here is now said by the tool itself,
 * one step at a time, which is where somebody answering can use it.
 */
export function BuildView() {
  return (
    <PageShell>
      <BuildFlow />
    </PageShell>
  );
}
