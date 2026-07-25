"use client";

import { useState } from "react";
import {
  Check,
  ChevronRight,
  ClipboardPaste,
  Copy,
  Download,
  Eye,
  Group,
  Layers,
  Minus,
  Monitor,
  Plus,
  Redo2,
  RotateCcw,
  Settings2,
  Smartphone,
  Tablet,
  Trash2,
  Undo2,
  X,
} from "lucide-react";

import type { Device } from "@/lib/builder/types";
import { useBuilder, ZOOM_STOPS } from "@/lib/hooks/use-builder";
import { cn } from "@/lib/utils";

import { Inspector } from "./inspector";
import { LeftPanel } from "./left-panel";
import { NodeView } from "./node-view";
import { PanelResizer } from "./panel-resizer";

/** The three widths the canvas previews, and what each one stands for. */
const DEVICES: { value: Device; icon: typeof Monitor; width: number }[] = [
  { value: "desktop", icon: Monitor, width: 1180 },
  { value: "tablet", icon: Tablet, width: 780 },
  { value: "mobile", icon: Smartphone, width: 390 },
];

type Drawer = "layers" | "inspector" | null;

/* Panel widths. The defaults are wide enough that a max-width scale fits on two
   rows and a layer name is not truncated at the third level of nesting, which is
   what the narrower first pass got wrong. */
const LEFT = { min: 200, max: 420, start: 280 };
const RIGHT = { min: 240, max: 480, start: 320 };

/**
 * The Builder.
 *
 * Three columns and a bar on a wide screen, which is the arrangement every canvas
 * editor has converged on for a reason: the document on the left, the thing itself
 * in the middle, its properties on the right, and the verbs across the top.
 *
 * Below `xl` the two side columns become drawers over the canvas rather than
 * disappearing. A tool that only works at one width is not responsive, it is
 * desktop only with a broken small screen, and the panels are where the work
 * happens: hiding them leaves a canvas nobody can edit.
 *
 * Both docked panels drag to resize. Their widths live here rather than in the
 * document, because how wide somebody likes their inspector is a property of them
 * working, not of the thing they are building, and it has no business in the undo
 * stack or the export.
 *
 * The canvas is a real render, not a preview. Those are the same elements and the
 * same computed styles the export writes out, so what is on screen is the artefact
 * rather than a picture of it.
 *
 * What this deliberately does not do yet: per breakpoint overrides. The device
 * switcher changes the canvas width so you can see how a layout behaves, but a
 * value set here applies at every size. Storing three values per property is a
 * different data model and it should be a decision, not a side effect.
 */
export function BuilderShell() {
  const builder = useBuilder();
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [drawer, setDrawer] = useState<Drawer>(null);
  const [leftWidth, setLeftWidth] = useState(LEFT.start);
  const [rightWidth, setRightWidth] = useState(RIGHT.start);

  const device = DEVICES.find((entry) => entry.value === builder.device);
  const node = builder.selected;
  const locked = node?.id === builder.root.id;

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(builder.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* Clipboard access can be refused. The code is on screen to select by hand. */
    }
  }

  return (
    <div className="flex h-[calc(100svh-var(--nav-height))] min-h-0 flex-col bg-panel-bg">
      <header className="flex shrink-0 items-center gap-2 bg-bg px-2.5 py-2 sm:px-3">
        {/* On a narrow screen the two drawer toggles take the place the side
            columns would have had. */}
        <div className="flex flex-1 items-center gap-0.5">
          <BarButton
            icon={Layers}
            label="Layers and components"
            onClick={() => setDrawer(drawer === "layers" ? null : "layers")}
            active={drawer === "layers"}
            className="lg:hidden"
          />
          <BarButton
            icon={Settings2}
            label="Properties"
            onClick={() => setDrawer(drawer === "inspector" ? null : "inspector")}
            active={drawer === "inspector"}
            className="xl:hidden"
          />
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          <span aria-hidden className="mx-1 h-5 w-px bg-line" />
          <BarButton
            icon={Undo2}
            label="Undo"
            onClick={builder.undo}
            disabled={!builder.canUndo}
          />
          <BarButton
            icon={Redo2}
            label="Redo"
            onClick={builder.redo}
            disabled={!builder.canRedo}
          />
          <BarButton
            icon={RotateCcw}
            label="Start again"
            onClick={builder.reset}
            className="hidden sm:flex"
          />
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <div className="flex items-center gap-0.5 rounded-[8px] bg-panel-bg p-0.5">
            {DEVICES.map((entry) => (
              <button
                key={entry.value}
                type="button"
                onClick={() => builder.setDevice(entry.value)}
                aria-label={entry.value}
                aria-pressed={builder.device === entry.value}
                className={cn(
                  "flex size-7 items-center justify-center rounded-[6px] transition-colors",
                  builder.device === entry.value
                    ? "bg-white text-ink"
                    : "text-faint hover:text-ink",
                )}
              >
                <entry.icon className="size-3.5" />
              </button>
            ))}
          </div>

          {/* Zoom, as a stepper rather than a slider: the stops are the useful
              values and a slider invites 87%. */}
          <div className="hidden items-center gap-0.5 rounded-[8px] bg-panel-bg p-0.5 sm:flex">
            <BarButton
              icon={Minus}
              label="Zoom out"
              onClick={() => builder.nudgeZoom(-1)}
              disabled={builder.zoom <= ZOOM_STOPS[0]}
              plain
            />
            <button
              type="button"
              onClick={() => builder.setZoom(100)}
              title="Reset zoom"
              className="min-w-10 text-center font-mono text-[9.5px] font-bold text-faint tabular-nums transition-colors hover:text-ink"
            >
              {builder.zoom}%
            </button>
            <BarButton
              icon={Plus}
              label="Zoom in"
              onClick={() => builder.nudgeZoom(1)}
              disabled={builder.zoom >= ZOOM_STOPS[ZOOM_STOPS.length - 1]}
              plain
            />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end gap-1.5">
          <BarButton
            icon={Eye}
            label="Preview, press P"
            onClick={() => builder.setPreview(!builder.preview)}
            active={builder.preview}
          />

          <button
            type="button"
            onClick={() => setShowCode(true)}
            className="flex shrink-0 items-center gap-1.5 rounded-btn-sm bg-ink px-3 py-2 text-[12px] font-bold text-white transition-opacity hover:opacity-85 sm:px-3.5"
          >
            <Download aria-hidden className="size-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </header>

      <div className="relative flex min-h-0 flex-1 gap-1 p-2 pt-0">
        <aside
          className="hidden shrink-0 flex-col rounded-card bg-bg lg:flex"
          style={{ width: leftWidth }}
        >
          <LeftPanel builder={builder} />
        </aside>

        <PanelResizer
          side="left"
          width={leftWidth}
          min={LEFT.min}
          max={LEFT.max}
          onChange={setLeftWidth}
          className="hidden lg:block"
        />

        <div className="flex min-w-0 flex-1 flex-col rounded-card bg-bg">
          {/* The selection row. Hidden in preview, because preview means chrome
              off and this is chrome. */}
          {builder.preview ? null : (
            <div className="flex shrink-0 items-center gap-1.5 px-2.5 py-2.5 sm:px-3">
              <nav
                aria-label="Selection path"
                className="panel-scroll flex min-w-0 items-center gap-1 overflow-x-auto"
              >
                {builder.path.length ? (
                  builder.path.map((entry, at) => (
                    <span
                      key={entry.id}
                      className="flex shrink-0 items-center gap-1"
                    >
                      {at > 0 ? (
                        <ChevronRight
                          aria-hidden
                          className="size-3 shrink-0 text-faint/60"
                        />
                      ) : null}
                      <button
                        type="button"
                        onClick={() => builder.select(entry.id)}
                        className={cn(
                          "rounded-[5px] px-1.5 py-0.5 font-mono text-[9.5px] font-bold tracking-[0.08em] whitespace-nowrap uppercase transition-colors",
                          at === builder.path.length - 1
                            ? "bg-soft text-brand"
                            : "text-faint hover:text-ink",
                        )}
                      >
                        {entry.kind}
                      </button>
                    </span>
                  ))
                ) : (
                  <span className="px-1.5 font-mono text-[9.5px] tracking-[0.08em] whitespace-nowrap text-faint uppercase">
                    Click anything to select it
                  </span>
                )}
              </nav>

              {node ? (
                <div className="ml-auto flex shrink-0 items-center gap-0.5 rounded-[8px] bg-panel-bg p-0.5">
                  <BarButton
                    plain
                    icon={Plus}
                    label="Add a container inside"
                    onClick={() => builder.add("container")}
                  />
                  <BarButton
                    plain
                    icon={Group}
                    label="Wrap in a container"
                    onClick={() => builder.wrap(node.id)}
                    disabled={locked}
                  />
                  <BarButton
                    plain
                    icon={Copy}
                    label="Copy"
                    onClick={() => builder.copy(node.id)}
                  />
                  <BarButton
                    plain
                    icon={ClipboardPaste}
                    label="Paste inside"
                    onClick={builder.paste}
                    disabled={!builder.hasCopy}
                  />
                  <BarButton
                    icon={Trash2}
                    label="Delete"
                    onClick={() => builder.remove(node.id)}
                    disabled={locked}
                    danger
                  />
                </div>
              ) : null}
            </div>
          )}

          {/* Clicking the mat deselects. A canvas you cannot click out of feels
              stuck the first time you try. */}
          <div
            className="panel-scroll min-h-0 flex-1 overflow-auto bg-[#e9edf3] p-3 sm:p-6"
            onClick={() => builder.select(null)}
          >
            {/* Zoom scales from the top centre, so zooming in keeps the top of the
                design in place instead of drifting off the top of the frame. */}
            <div
              className="mx-auto overflow-hidden rounded-[10px] bg-white transition-[max-width,transform] duration-300 ease-[var(--ease-out-soft)]"
              style={{
                maxWidth: device?.width,
                transform: `scale(${builder.zoom / 100})`,
                transformOrigin: "top center",
              }}
            >
              <NodeView node={builder.root} builder={builder} />
            </div>
          </div>
        </div>

        <PanelResizer
          side="right"
          width={rightWidth}
          min={RIGHT.min}
          max={RIGHT.max}
          onChange={setRightWidth}
          className="hidden xl:block"
        />

        <aside
          className="hidden shrink-0 flex-col rounded-card bg-bg xl:flex"
          style={{ width: rightWidth }}
        >
          <Inspector builder={builder} />
        </aside>

        {/* Drawers. Absolute inside the work area rather than fixed to the
            viewport, so they cannot cover the bar with the button that closed
            them. */}
        {drawer ? (
          <>
            {/* Both the scrim and the drawer disappear at the width its panel
                docks at, so growing the window resolves an open drawer into the
                column it stands in for. */}
            <button
              type="button"
              aria-label="Close panel"
              onClick={() => setDrawer(null)}
              className={cn(
                "absolute inset-0 z-20 bg-ink/15 backdrop-blur-[1px]",
                drawer === "layers" ? "lg:hidden" : "xl:hidden",
              )}
            />

            <aside
              className={cn(
                "absolute inset-y-2 z-30 flex w-[300px] max-w-[calc(100%-1rem)] flex-col rounded-card bg-bg shadow-[0_18px_48px_-12px_rgba(18,35,59,0.28)]",
                drawer === "layers" ? "left-2 lg:hidden" : "right-2 xl:hidden",
              )}
            >
              <div className="flex shrink-0 items-center justify-end px-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDrawer(null)}
                  aria-label="Close panel"
                  className="flex size-7 items-center justify-center rounded-[6px] text-faint transition-colors hover:bg-panel-bg hover:text-ink"
                >
                  <X className="size-3.5" />
                </button>
              </div>

              {drawer === "layers" ? (
                <LeftPanel builder={builder} />
              ) : (
                <Inspector builder={builder} />
              )}
            </aside>
          </>
        ) : null}
      </div>

      {showCode ? (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-ink/25 p-4 backdrop-blur-[2px]"
          onClick={() => setShowCode(false)}
        >
          <div
            className="flex max-h-[80vh] w-full max-w-[720px] flex-col rounded-card bg-bg p-4 sm:p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[9px] font-bold tracking-[0.14em] text-brand uppercase">
                  Export
                </p>
                <h2 className="mt-1 text-[15px] font-extrabold tracking-[-0.01em] sm:text-[16px]">
                  React and Tailwind, ready to paste
                </h2>
              </div>

              <button
                type="button"
                onClick={copyCode}
                className="flex shrink-0 items-center gap-1.5 rounded-btn-sm bg-brand px-3 py-2 text-[12px] font-bold text-white transition-opacity hover:opacity-90"
              >
                {copied ? (
                  <Check aria-hidden className="size-3.5" strokeWidth={3} />
                ) : (
                  <Copy aria-hidden className="size-3.5" />
                )}
                {copied ? "Copied" : "Copy"}
              </button>

              <button
                type="button"
                onClick={() => setShowCode(false)}
                aria-label="Close"
                className="flex size-8 shrink-0 items-center justify-center rounded-[6px] text-faint transition-colors hover:text-ink"
              >
                <X className="size-4" />
              </button>
            </div>

            <pre className="panel-scroll mt-4 min-h-0 flex-1 overflow-auto rounded-btn-sm bg-panel-bg p-4 font-mono text-[11px] leading-[1.6] text-ink">
              {builder.code}
            </pre>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function BarButton({
  icon: Icon,
  label,
  onClick,
  disabled,
  danger,
  active,
  plain,
  className,
}: {
  icon: typeof Undo2;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  active?: boolean;
  /** Inside a group that already has a fill of its own. */
  plain?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={cn(
        "flex size-7 items-center justify-center rounded-[6px] transition-colors disabled:pointer-events-none disabled:opacity-30",
        active
          ? "bg-brand text-white"
          : danger
            ? "text-faint hover:bg-destructive/10 hover:text-destructive"
            : plain
              ? "text-faint hover:bg-white hover:text-ink"
              : "text-faint hover:bg-panel-bg hover:text-ink",
        className,
      )}
    >
      <Icon className="size-3.5" />
    </button>
  );
}
