"use client";

import { useRef } from "react";
import { Plus, X } from "lucide-react";

import type { StudioController } from "@/lib/hooks/use-colour-studio";
import { cn } from "@/lib/utils";

/**
 * The image tray. Several images held at once, switch between them freely, add
 * more at any point. Keeping the tray means a palette can be built from a logo,
 * a photograph and a screenshot without losing any of them.
 */
export function ImageTray({ studio }: { studio: StudioController }) {
  const input = useRef<HTMLInputElement>(null);

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {studio.tray.map((entry) => (
        <div key={entry.id} className="relative">
          <button
            type="button"
            onClick={() => studio.selectImage(entry.id)}
            aria-label={`Work on ${entry.name}`}
            aria-pressed={entry.id === studio.activeId}
            className={cn(
              "block size-13 overflow-hidden rounded-nav border-2 transition-colors",
              entry.id === studio.activeId
                ? "border-brand"
                : "border-line hover:border-brand/45",
            )}
          >
            {/* Data URLs from the visitor's own files. next/image has nothing to
                optimise here and would need every host allow-listed. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={entry.url}
              alt=""
              className="size-full bg-panel-bg object-cover"
            />
          </button>

          <button
            type="button"
            onClick={() => studio.removeImage(entry.id)}
            aria-label={`Remove ${entry.name}`}
            className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-ink/75 text-white transition-colors hover:bg-destructive"
          >
            <X className="size-3" />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => input.current?.click()}
        aria-label="Add another image"
        className="flex size-13 items-center justify-center rounded-nav border-2 border-dashed border-line text-brand transition-colors hover:border-brand/50 hover:bg-soft"
      >
        <Plus className="size-4" />
      </button>

      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(event) => {
          for (const file of Array.from(event.target.files ?? [])) {
            studio.addImageFromFile(file);
          }
          event.target.value = "";
        }}
      />
    </div>
  );
}
