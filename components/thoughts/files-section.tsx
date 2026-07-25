"use client";

import { useRef, useState } from "react";
import {
  FileSpreadsheet,
  FileText,
  Files,
  Image as ImageIcon,
  Presentation,
  X,
  type LucideIcon,
} from "lucide-react";

import { ACCEPT_ATTRIBUTE, formatBytes } from "@/lib/thoughts/files";
import type { CapturedFileKind } from "@/lib/thoughts/types";

import { DropZone } from "./drop-zone";
import { PanelSection } from "./panel-section";
import { SectionCount } from "./section-count";
import { useThoughtsSession } from "./thoughts-context";

const KIND_ICONS: Record<CapturedFileKind, LucideIcon> = {
  image: ImageIcon,
  pdf: FileText,
  doc: FileText,
  sheet: FileSpreadsheet,
  slides: Presentation,
  text: FileText,
};

/**
 * Files and screenshots. Three ways in, as the spec asks: drag and drop, click to
 * browse, and paste a screenshot from the clipboard. Every file gets its own row
 * with an "explain this file" note, because the explanation is what ends up in
 * the plan next to the thumbnail.
 *
 * The drop target is its own component, in `drop-zone.tsx`. Captured files sit
 * under it as recessed rows: a tinted fill inside the white card, so a file reads
 * as something held rather than as another box drawn around it.
 */
export function FilesSection() {
  const { files, addFiles, explainFile, removeFile } = useThoughtsSession();
  const input = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  return (
    <PanelSection
      label="Files and screenshots"
      icon={<Files className="size-3.5" />}
      active={files.length > 0}
      meta={<SectionCount value={files.length} />}
    >
      <DropZone
        dragging={dragging}
        onOpen={() => input.current?.click()}
        onDragStateChange={setDragging}
        onFiles={addFiles}
      />

      <input
        ref={input}
        type="file"
        multiple
        accept={ACCEPT_ATTRIBUTE}
        className="hidden"
        onChange={(event) => {
          if (event.target.files) addFiles(event.target.files);
          event.target.value = "";
        }}
      />

      {files.length ? (
        <ul className="mt-2.5 flex flex-col gap-2">
          {files.map((file) => {
            const Icon = KIND_ICONS[file.kind];

            return (
              <li
                key={file.id}
                className="group/file rounded-btn-sm bg-panel-bg p-2.5"
              >
                <div className="flex items-center gap-2">
                  {file.previewUrl ? (
                    /* A blob URL of a file the visitor just chose. next/image
                       would need the host allow-listed and buys nothing here. */
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={file.previewUrl}
                      alt=""
                      className="size-8 shrink-0 rounded-nav object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="flex size-8 shrink-0 items-center justify-center rounded-nav bg-soft text-brand"
                    >
                      <Icon className="size-3.5" />
                    </span>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11.5px] leading-tight font-bold">
                      {file.name}
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] leading-tight text-faint">
                      {formatBytes(file.size)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFile(file.id)}
                    aria-label={`Remove ${file.name}`}
                    className="flex size-6 shrink-0 items-center justify-center rounded-nav text-faint opacity-60 transition-all group-hover/file:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="size-3" />
                  </button>
                </div>

                <input
                  value={file.explain}
                  onChange={(event) => explainFile(file.id, event.target.value)}
                  placeholder="Explain this file"
                  aria-label={`Explain ${file.name}`}
                  className="mt-2 h-9 w-full rounded-btn-sm bg-white px-2.5 text-[11.5px] outline-none ring-1 ring-line ring-inset transition-shadow placeholder:text-faint focus:ring-brand/45"
                />
              </li>
            );
          })}
        </ul>
      ) : null}
    </PanelSection>
  );
}
