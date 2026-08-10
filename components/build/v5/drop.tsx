"use client";

import { useRef, useState } from "react";
import { FileText, ImageUp, X } from "lucide-react";

import {
  ACCEPTS,
  isPicture,
  readableSize,
  releaseFile,
  sendFile,
  type Attached,
} from "@/lib/build/upload";
import { cn } from "@/lib/utils";

/**
 * Somewhere to put a file.
 *
 * Drag onto it, or press it and choose. Both, because the two are not the same
 * habit: a picture gets dragged off a desktop and a document gets found in a
 * dialog, and a control that only does one of them is a control half the people
 * looking at it cannot use.
 *
 * The whole area is the target rather than a link inside it. A drop zone with a
 * small "browse" link in the middle is a large shape that mostly does nothing.
 *
 * It shows what it took: the picture itself for an image, the name and size for
 * anything else. A list of file names is a receipt; a row of thumbnails is a
 * reminder of what you actually attached, which is what somebody needs when
 * they are deciding whether to add another.
 */
export function DropZone({
  label,
  tap = "Choose files to attach",
  note,
  files,
  onAdd,
  onDrop,
  className,
}: {
  label: string;
  /** What it says on a phone, where there is nothing to drop onto it. */
  tap?: string;
  note?: string;
  files: readonly Attached[];
  onAdd: (taken: Attached[]) => void;
  onDrop: (at: number) => void;
  className?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [wrong, setWrong] = useState<string | null>(null);

  /* Every file is attempted, and the ones that fail are named. Stopping at the
     first refusal on a drop of six tells somebody one thing was too big and
     leaves them to work out which of the other five made it. */
  const take = async (chosen: FileList | null) => {
    if (!chosen?.length) return;
    setWrong(null);

    const taken: Attached[] = [];
    const refused: string[] = [];

    for (const file of Array.from(chosen)) {
      try {
        taken.push(await sendFile(file));
      } catch (error) {
        refused.push(
          error instanceof Error ? error.message : `${file.name} would not go.`,
        );
      }
    }

    if (taken.length) onAdd(taken);
    if (refused.length) setWrong(refused.join(" "));
  };

  return (
    <div className={cn("min-w-0", className)}>
      <button
        type="button"
        onClick={() => input.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setOver(false);
          void take(event.dataTransfer.files);
        }}
        className={cn(
          "flex w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[14px] border border-dashed px-5 py-6 text-center transition-colors max-sm:gap-1 max-sm:px-4 max-sm:py-4",
          over
            ? "border-ink bg-well"
            : "border-border bg-canvas hover:border-ink hover:bg-canvas-firm",
        )}
      >
        <ImageUp
          aria-hidden
          className="size-5 text-idx max-sm:size-[18px]"
          strokeWidth={1.9}
        />

        {/* Two labels, one control.

            Every one of these says "drop files here, or choose them", which is
            a true sentence on a desk and half a lie on a phone: there is
            nothing to drag from and nothing to drag with, so half the offer
            names a gesture that does not exist and the half that works reads
            as the fallback. Below `sm` it says the one thing that is true
            there. */}
        <b className="text-[13.5px] font-bold text-ink max-sm:text-[12.5px]">
          <span className="max-sm:hidden">{label}</span>
          <span className="hidden max-sm:inline">{tap}</span>
        </b>

        {note ? (
          <span className="max-w-[42ch] text-[12px] leading-[1.45] text-quiet max-sm:text-[11.5px]">
            {note}
          </span>
        ) : null}
      </button>

      <input
        ref={input}
        type="file"
        multiple
        accept={ACCEPTS}
        className="sr-only"
        onChange={(event) => {
          void take(event.target.files);
          /* Cleared, so choosing the same file twice in a row still fires. */
          event.target.value = "";
        }}
      />

      {wrong ? (
        <p
          role="alert"
          className="mt-2 text-[12px] leading-[1.45] text-blocked"
        >
          {wrong}
        </p>
      ) : null}

      {files.length ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {files.map((file, at) => (
            <li
              key={`${file.name}-${at}`}
              className="group/att flex min-w-0 items-center gap-2.5 rounded-[12px] bg-canvas py-1.5 pr-1.5 pl-2"
            >
              <span
                aria-hidden
                className="flex size-9 flex-none items-center justify-center overflow-hidden rounded-[8px] bg-field"
              >
                {isPicture(file.type) ? (
                  /* The real picture. `next/image` optimises a URL it can
                     fetch, and a `blob:` only exists in this tab. */
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={file.url}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : (
                  <FileText className="size-4 text-idx" strokeWidth={1.9} />
                )}
              </span>

              <span className="min-w-0">
                <b className="block max-w-[22ch] truncate text-[12.5px] leading-[1.2] font-semibold text-ink">
                  {file.name}
                </b>
                <span className="mt-0.5 block font-mono text-[9px] font-bold tracking-[0.1em] text-label uppercase">
                  {readableSize(file.size)}
                  {file.stored ? "" : " · in this tab"}
                </span>
              </span>

              <button
                type="button"
                aria-label={`Remove ${file.name}`}
                onClick={() => {
                  releaseFile(file);
                  onDrop(at);
                }}
                className="flex size-6 flex-none cursor-pointer items-center justify-center rounded-pill text-label transition-colors hover:bg-hair hover:text-ink"
              >
                <X aria-hidden className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
