"use client";

import { PencilLine } from "lucide-react";

import { PanelSection } from "./panel-section";
import { SectionCount } from "./section-count";
import { useThoughtsSession } from "./thoughts-context";

export function NotesSection() {
  const { notes, setNotes } = useThoughtsSession();

  return (
    <PanelSection
      label="Notes"
      icon={<PencilLine className="size-3.5" />}
      active={notes.trim().length > 0}
      meta={<SectionCount value={notes.trim().length} />}
    >
      {/* field-sizing grows the box with the text, so there is no resize handle
          to drag and no scrollbar inside a scrollbar. It starts at four lines and
          takes the rest as it is needed. */}
      <textarea
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        aria-label="Notes"
        rows={4}
        placeholder="Anything else you'd like us to know. The more detail about your business, your customers and your taste, the better."
        className="field-sizing-content max-h-60 min-h-[88px] w-full resize-none rounded-btn-sm bg-panel-bg p-3 text-[12px] leading-[1.55] outline-none ring-inset transition-shadow placeholder:text-faint focus:ring-1 focus:ring-brand/45"
      />
    </PanelSection>
  );
}
