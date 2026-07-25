"use client";

import { useEffect } from "react";
import { Droplet, ImagePlus, Info, MonitorUp, Palette, Upload, X } from "lucide-react";

import { useColourStudio } from "@/lib/hooks/use-colour-studio";
import { cn } from "@/lib/utils";

import { useThoughtsSession } from "../thoughts-context";
import { ColourTuner } from "./colour-tuner";
import { ImageStage } from "./image-stage";
import { ImageTray } from "./image-tray";

/**
 * The Colour Studio, from TCT_Scope_Spec.md §5.3.
 *
 * Five ways to land on a colour: drop or paste an image, snapshot a screen, use
 * the system eyedropper anywhere, auto-pick from an image, or dial it in by hand.
 * The two that depend on the browser degrade with a plain explanation rather than
 * a dead button.
 *
 * Rendered outside the Thoughts panel on purpose. The panel is transformed while
 * it slides, and a transformed ancestor becomes the containing block for fixed
 * children, which would trap this modal inside the panel.
 */
export function ColourStudio() {
  const { studioOpen, closeStudio, addColour, colours, colourLimit } =
    useThoughtsSession();
  const studio = useColourStudio();

  const full = colours.length >= colourLimit;

  useEffect(() => {
    if (!studioOpen) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") closeStudio();
    }

    /* Paste an image straight in while the studio is open. */
    function onPaste(event: ClipboardEvent) {
      for (const item of Array.from(event.clipboardData?.files ?? [])) {
        if (item.type.startsWith("image/")) studio.addImageFromFile(item);
      }
    }

    window.addEventListener("keydown", onKey);
    window.addEventListener("paste", onPaste);

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("paste", onPaste);
    };
  }, [studioOpen, closeStudio, studio]);

  async function snapshotScreen() {
    if (!navigator.mediaDevices?.getDisplayMedia) {
      studio.setNote(
        "Snapshotting a screen needs Chrome or Edge on https or localhost. You can still drop or paste a screenshot.",
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });

      const video = document.createElement("video");
      video.srcObject = stream;
      await video.play();
      /* One beat, so the first frame is the screen rather than black. */
      await new Promise((resolve) => setTimeout(resolve, 200));

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d")?.drawImage(video, 0, 0);

      for (const track of stream.getTracks()) track.stop();

      studio.addImageFromUrl(canvas.toDataURL("image/png"), "Screenshot");
    } catch {
      studio.setNote("Snapshot cancelled or blocked.");
    }
  }

  async function pickAnywhere() {
    const EyeDropperCtor = (
      window as unknown as {
        EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> };
      }
    ).EyeDropper;

    if (!EyeDropperCtor) {
      studio.setNote(
        "The system eyedropper needs Chrome or Edge on https or localhost. You can still pick from an image or dial a colour in.",
      );
      return;
    }

    try {
      const result = await new EyeDropperCtor().open();
      studio.setFromHex(result.sRGBHex);
    } catch {
      /* Dismissed. Nothing to report. */
    }
  }

  function addColours(hexes: string[]) {
    for (const hex of hexes) addColour(hex);
  }

  const hasImages = studio.tray.length > 0;

  const tools = [
    { label: "Add image", icon: ImagePlus, action: "file" as const },
    { label: "Snapshot a screen", icon: MonitorUp, action: "snap" as const },
    { label: "Pick anywhere", icon: Droplet, action: "eyedropper" as const },
  ];

  return (
    <div
      aria-hidden={!studioOpen}
      className={cn(
        "fixed inset-0 z-60 flex items-center justify-center p-4 transition-opacity duration-[280ms] ease-[var(--ease-out-soft)]",
        studioOpen ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <button
        type="button"
        tabIndex={studioOpen ? 0 : -1}
        aria-label="Close the Colour Studio"
        onClick={closeStudio}
        className="absolute inset-0 bg-ink/55 backdrop-blur-[3px]"
      />

      <div
        role="dialog"
        aria-modal={studioOpen}
        aria-label="Colour Studio"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          for (const file of Array.from(event.dataTransfer.files)) {
            if (file.type.startsWith("image/")) studio.addImageFromFile(file);
          }
        }}
        className={cn(
          "relative flex max-h-[92vh] w-[min(980px,96vw)] flex-col overflow-hidden rounded-card bg-card shadow-[0_28px_80px_rgba(18,35,59,0.42)] transition-transform duration-[280ms] ease-[var(--ease-out-soft)]",
          studioOpen ? "scale-100" : "scale-[0.97]",
        )}
      >
        {/* No rule under the header, the same as the panel's chrome. */}
        <header className="flex shrink-0 items-center gap-2 px-4 pt-4 pb-2">
          <span
            aria-hidden
            className="flex size-8 shrink-0 items-center justify-center rounded-nav bg-soft text-brand"
          >
            <Palette className="size-4" />
          </span>

          <div className="min-w-0">
            <h2 className="text-[14px] leading-tight font-extrabold tracking-[-0.01em]">
              Colour Studio
            </h2>
            <p className="text-[11.5px] leading-tight text-faint">
              pick from anywhere, tune it, keep it
            </p>
          </div>

          <button
            type="button"
            onClick={closeStudio}
            aria-label="Close the Colour Studio"
            className="ml-auto flex size-8 shrink-0 items-center justify-center rounded-nav text-faint transition-colors hover:bg-soft hover:text-ink"
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="panel-scroll min-h-0 flex-1 overflow-y-auto px-4 pt-2 pb-4">
          <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
            <div className="min-w-0">
              <div className="flex flex-wrap gap-2">
                {tools.map((tool) => (
                  <button
                    key={tool.label}
                    type="button"
                    onClick={() => {
                      if (tool.action === "snap") void snapshotScreen();
                      else if (tool.action === "eyedropper") void pickAnywhere();
                      else document.getElementById("studio-file")?.click();
                    }}
                    className="flex h-9 items-center gap-1.5 rounded-btn-sm border border-line bg-card px-3 text-[12.5px] font-semibold transition-colors hover:border-brand/40 hover:bg-soft"
                  >
                    <tool.icon aria-hidden className="size-3.5 text-brand" />
                    {tool.label}
                  </button>
                ))}
              </div>

              <input
                id="studio-file"
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

              {studio.note ? (
                <p
                  role="status"
                  className="mt-3 flex gap-2 rounded-btn-sm border border-brand/20 bg-soft p-3 text-[12px] leading-[1.5] text-body"
                >
                  <Info aria-hidden className="mt-px size-4 shrink-0 text-brand" />
                  {studio.note}
                </p>
              ) : null}

              {hasImages ? (
                <div className="mt-3">
                  {/* Keyed on the active image: switching image is a fresh
                      stage, with the zoom already back at 1. */}
                  <ImageStage
                    key={studio.activeId}
                    studio={studio}
                    onAddColours={addColours}
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => document.getElementById("studio-file")?.click()}
                  className="group/dz mt-3 flex w-full flex-col items-center gap-2 rounded-card border-2 border-dashed border-line p-10 text-center transition-colors hover:border-brand/45 hover:bg-soft/60"
                >
                  <span
                    aria-hidden
                    className="flex size-11 items-center justify-center rounded-full bg-soft text-brand transition-transform group-hover/dz:scale-105"
                  >
                    <Upload className="size-5" />
                  </span>
                  <span className="text-[13.5px] font-bold text-ink">
                    Drop images here
                  </span>
                  <span className="text-[11.5px] text-faint">
                    click to browse · paste a screenshot · or snapshot a screen
                  </span>
                </button>
              )}

              {hasImages ? <ImageTray studio={studio} /> : null}
            </div>

            <ColourTuner
              studio={studio}
              onAdd={(hex) => addColour(hex)}
              disabled={full}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
