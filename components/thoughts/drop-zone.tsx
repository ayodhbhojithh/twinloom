"use client";

import { Upload } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * The drop target.
 *
 * Not a dashed rectangle. A dashed rectangle is the default answer to this and it
 * only ever says "form field you may drop on"; it also puts a full outline back on
 * a panel that has had them taken off everywhere else.
 *
 * This says the same thing with an illustration instead. Three cards sit fanned
 * like a small stack of paper, the front one carrying the arrow, in a recessed
 * tinted well. Approach it and the stack spreads and the front card lifts, the way
 * a real pile opens under your hand. Drag over it and the well tints, the stack
 * spreads further and four crop marks snap to the corners.
 *
 * Crop marks rather than a border: two edges of a small square in each corner is
 * enough to fence an area, and it reads as a target being framed rather than as
 * one more box.
 */
export function DropZone({
  dragging,
  onOpen,
  onDragStateChange,
  onFiles,
}: {
  dragging: boolean;
  onOpen: () => void;
  onDragStateChange: (dragging: boolean) => void;
  onFiles: (files: FileList) => void;
}) {
  /* One shared pair of corner classes: each mark is two borders, positioned by the
     side it belongs to. */
  const CORNERS = [
    "top-2 left-2 border-t-2 border-l-2 rounded-tl-[5px] group-hover/dz:-translate-x-0.5 group-hover/dz:-translate-y-0.5",
    "top-2 right-2 border-t-2 border-r-2 rounded-tr-[5px] group-hover/dz:translate-x-0.5 group-hover/dz:-translate-y-0.5",
    "bottom-2 left-2 border-b-2 border-l-2 rounded-bl-[5px] group-hover/dz:-translate-x-0.5 group-hover/dz:translate-y-0.5",
    "bottom-2 right-2 border-b-2 border-r-2 rounded-br-[5px] group-hover/dz:translate-x-0.5 group-hover/dz:translate-y-0.5",
  ];

  return (
    <button
      type="button"
      onClick={onOpen}
      onDragOver={(event) => {
        event.preventDefault();
        onDragStateChange(true);
      }}
      onDragLeave={() => onDragStateChange(false)}
      onDrop={(event) => {
        event.preventDefault();
        onDragStateChange(false);
        onFiles(event.dataTransfer.files);
      }}
      className={cn(
        "group/dz relative flex w-full flex-col items-center gap-2 overflow-hidden rounded-card px-3 py-4 text-center transition-colors duration-300",
        dragging ? "bg-soft" : "bg-panel-bg hover:bg-soft/60",
      )}
    >
      {CORNERS.map((corner) => (
        <span
          key={corner}
          aria-hidden
          className={cn(
            "pointer-events-none absolute size-3 border-brand transition-all duration-300",
            corner,
            dragging ? "opacity-100" : "opacity-0 group-hover/dz:opacity-45",
          )}
        />
      ))}

      {/* The stack. Two leaves behind, the arrow card in front. */}
      <span aria-hidden className="relative block h-[38px] w-[58px]">
        <span
          className={cn(
            "absolute inset-y-0.5 left-2.5 w-9 rounded-[7px] bg-white shadow-card transition-transform duration-300 ease-[var(--ease-out-soft)]",
            dragging
              ? "-translate-x-2.5 -rotate-[20deg]"
              : "-rotate-[11deg] group-hover/dz:-translate-x-1.5 group-hover/dz:-rotate-[17deg]",
          )}
        />
        <span
          className={cn(
            "absolute inset-y-0.5 right-2.5 w-9 rounded-[7px] bg-white shadow-card transition-transform duration-300 ease-[var(--ease-out-soft)]",
            dragging
              ? "translate-x-2.5 rotate-[20deg]"
              : "rotate-[11deg] group-hover/dz:translate-x-1.5 group-hover/dz:rotate-[17deg]",
          )}
        />
        <span
          className={cn(
            "absolute inset-y-0 left-1/2 flex w-9 -translate-x-1/2 items-center justify-center rounded-[7px] text-white transition-all duration-300 ease-[var(--ease-out-soft)]",
            dragging
              ? "-translate-y-1 bg-brand shadow-cta"
              : "bg-brand/90 group-hover/dz:-translate-y-0.5 group-hover/dz:bg-brand",
          )}
        >
          <Upload
            className={cn(
              "size-4 transition-transform duration-300",
              dragging && "-translate-y-px",
            )}
          />
        </span>
      </span>

      <span className="text-[12px] leading-tight font-bold text-ink">
        {dragging ? "Drop them here" : "Drag files here"}
      </span>

      <span className="font-mono text-[10px] leading-tight tracking-[0.04em] text-faint">
        click to browse · or paste a screenshot
      </span>
    </button>
  );
}
