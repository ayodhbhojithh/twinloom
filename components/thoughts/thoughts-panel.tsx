"use client";

import { useEffect } from "react";
import { AlertCircle, Lightbulb, Sparkles, X } from "lucide-react";

import { cn } from "@/lib/utils";

import { ColoursSection } from "./colours-section";
import { FilesSection } from "./files-section";
import { LinksSection } from "./links-section";
import { NotesSection } from "./notes-section";
import { PanelFooter } from "./panel-footer";
import { useThoughtsSession } from "./thoughts-context";

const INTRO =
  "Add anything that helps us picture what you have in mind: a brief, screenshots, your colours, or websites you like. Keep adding as you go. Nothing here is required.";

const GDPR = "Please don't upload personal data.";

/**
 * Each child of the panel body rises into place a beat after the sheet lands, in
 * order, so opening the panel reads as one movement rather than a slab arriving.
 *
 * A transition rather than an animation, and keyed off `open` rather than a
 * remount, so the drafts sitting in the section inputs survive a close and
 * reopen.
 */
function Rise({
  open,
  delay,
  className,
  children,
}: {
  open: boolean;
  delay: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{ transitionDelay: open ? `${delay}ms` : "0ms" }}
      className={cn(
        "transition-[opacity,transform] duration-[420ms] ease-[var(--ease-out-soft)]",
        open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * The panel. Docked right, and the page shifts to make room rather than being
 * covered, which is what lets someone keep working while it is open
 * (TCT_Scope_Spec.md §5.1).
 *
 * It reads as part of the site rather than as a separate tool: no rules in the
 * chrome, the same hairlines and radii as the page, the brand blue for anything
 * active, and the faintest tint behind the white capture cards.
 */
export function ThoughtsPanel() {
  const { open, setOpen, addFiles, errors, dismissErrors } =
    useThoughtsSession();

  /* Paste a screenshot from anywhere in the panel, not just over the dropzone. */
  useEffect(() => {
    if (!open) return;

    function onPaste(event: ClipboardEvent) {
      const files = event.clipboardData?.files;
      if (files?.length) addFiles(files);
    }

    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [open, addFiles]);

  useEffect(() => {
    if (!open) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  return (
    <>
      {/* Below the panel breakpoint the sheet covers the page, so it gets a scrim
          to sit on. Above it the page shifts instead and there is nothing to
          dim. */}
      <button
        type="button"
        tabIndex={open ? 0 : -1}
        aria-label="Close panel"
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-ink/20 backdrop-blur-[2px] transition-opacity duration-[420ms] ease-[var(--ease-out-soft)] panel:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        id="thoughts-panel"
        aria-label="Thoughts and inspiration"
        aria-hidden={!open}
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-panel-bg transition-[transform,box-shadow] duration-[420ms] ease-[var(--ease-out-soft)] panel:w-panel",
          open
            ? "translate-x-0 shadow-[-18px_0_56px_rgba(18,35,59,0.16)]"
            : "pointer-events-none translate-x-full shadow-none",
        )}
      >
        {/* No outlines anywhere. The surface is tinted, the sections are white
            cards on it, and every control is a recessed fill inside those. Depth
            does the dividing that borders used to. */}
        <Rise open={open} delay={90} className="shrink-0 px-3.5 pt-3.5 pb-2.5">
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="flex size-7 shrink-0 items-center justify-center rounded-nav bg-soft text-brand"
            >
              <Sparkles className="size-3.5" />
            </span>

            <div className="min-w-0">
              <h2 className="text-[13px] leading-tight font-extrabold tracking-[-0.01em]">
                Thoughts &amp; inspiration
              </h2>
              <p className="mt-0.5 font-mono text-[9.5px] leading-tight tracking-[0.06em] text-faint uppercase">
                add as you go
              </p>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close panel"
              className="ml-auto flex size-7 shrink-0 items-center justify-center rounded-nav text-faint transition-colors hover:bg-soft hover:text-ink"
            >
              <X className="size-4" />
            </button>
          </div>
        </Rise>

        <div className="panel-scroll min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-3.5 pt-0 pb-1">
          <Rise open={open} delay={140}>
            <p className="flex gap-2 rounded-card bg-soft p-3 text-[11.5px] leading-[1.55] text-body">
              <Lightbulb
                aria-hidden
                className="mt-px size-3.5 shrink-0 text-brand"
              />
              <span>
                {INTRO} <span className="font-semibold text-ink">{GDPR}</span>
              </span>
            </p>
          </Rise>

          {errors.length ? (
            <div
              role="alert"
              className="mt-2.5 rounded-card bg-destructive/6 p-3"
            >
              <div className="flex items-center gap-2">
                <AlertCircle
                  aria-hidden
                  className="size-4 shrink-0 text-destructive"
                />
                <span className="text-[11.5px] font-bold text-destructive">
                  Not added
                </span>
                <button
                  type="button"
                  onClick={dismissErrors}
                  aria-label="Dismiss"
                  className="ml-auto rounded p-0.5 text-destructive/70 transition-colors hover:text-destructive"
                >
                  <X className="size-3.5" />
                </button>
              </div>
              <ul className="mt-2 flex flex-col gap-1">
                {errors.map((error) => (
                  <li
                    key={error}
                    className="text-[11.5px] leading-[1.45] text-body"
                  >
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-2.5 flex flex-col gap-2.5">
            <Rise open={open} delay={190}>
              <FilesSection />
            </Rise>
            <Rise open={open} delay={235}>
              <ColoursSection />
            </Rise>
            <Rise open={open} delay={280}>
              <LinksSection />
            </Rise>
            <Rise open={open} delay={325}>
              <NotesSection />
            </Rise>
          </div>
        </div>

        <Rise open={open} delay={370} className="shrink-0">
          <PanelFooter />
        </Rise>
      </aside>
    </>
  );
}
