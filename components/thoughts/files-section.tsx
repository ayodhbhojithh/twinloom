"use client";

import { useRef, useState } from "react";
import {
  FileSpreadsheet,
  FileText,
  Files,
  Image as ImageIcon,
  Presentation,
  Upload,
  X,
  type LucideIcon,
} from "lucide-react";

import { ACCEPT_ATTRIBUTE, formatBytes } from "@/lib/thoughts/files";
import type { CapturedFileKind } from "@/lib/thoughts/types";
import { cn } from "@/lib/utils";

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
 */
export function FilesSection() {
  const { files, addFiles, explainFile, removeFile } = useThoughtsSession();
  const input = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  return (
    <PanelSection
      label="Files and screenshots"
      icon={<Files className="size-3.5" />}
      meta={<SectionCount value={files.length} />}
    >
      <button
        type="button"
        onClick={() => input.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          addFiles(event.dataTransfer.files);
        }}
        className={cn(
          "group/dz flex w-full flex-col items-center gap-2 rounded-card border-2 border-dashed p-5 text-center transition-all",
          dragging
            ? "scale-[1.01] border-brand bg-soft"
            : "border-line bg-card hover:border-brand/45 hover:bg-soft/60",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "flex size-9 items-center justify-center rounded-full transition-all",
            dragging
              ? "bg-brand text-white"
              : "bg-soft text-brand group-hover/dz:scale-105",
          )}
        >
          <Upload className="size-4" />
        </span>

        <span className="text-[12.5px] font-bold text-ink">
          {dragging ? "Drop them here" : "Drag files here"}
        </span>
        <span className="text-[11px] leading-[1.45] text-faint">
          click to browse · or paste a screenshot
        </span>
      </button>

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
        <ul className="mt-3 flex flex-col gap-2">
          {files.map((file) => {
            const Icon = KIND_ICONS[file.kind];

            return (
              <li
                key={file.id}
                className="group/file rounded-card border border-line bg-card p-3 transition-colors focus-within:border-brand/40"
              >
                <div className="flex items-center gap-2">
                  {file.previewUrl ? (
                    /* A blob URL of a file the visitor just chose. next/image
                       would need the host allow-listed and buys nothing here. */
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={file.previewUrl}
                      alt=""
                      className="size-9 shrink-0 rounded-nav border border-line object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="flex size-9 shrink-0 items-center justify-center rounded-nav bg-soft text-brand"
                    >
                      <Icon className="size-4" />
                    </span>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12.5px] font-bold">
                      {file.name}
                    </p>
                    <p className="font-mono text-[10.5px] text-faint">
                      {formatBytes(file.size)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFile(file.id)}
                    aria-label={`Remove ${file.name}`}
                    className="flex size-7 shrink-0 items-center justify-center rounded-nav text-faint opacity-60 transition-all group-hover/file:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>

                <input
                  value={file.explain}
                  onChange={(event) => explainFile(file.id, event.target.value)}
                  placeholder="Explain this file"
                  aria-label={`Explain ${file.name}`}
                  className="mt-2 h-9 w-full rounded-btn-sm border border-line bg-panel-bg px-3 text-[12px] outline-none transition-colors placeholder:text-faint focus:border-brand focus:bg-card"
                />
              </li>
            );
          })}
        </ul>
      ) : null}
    </PanelSection>
  );
}
