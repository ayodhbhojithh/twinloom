"use client";

import { useState } from "react";
import {
  Check,
  ChevronRight,
  Copy,
  Download,
  Group,
  Monitor,
  Plus,
  Redo2,
  RotateCcw,
  Smartphone,
  Tablet,
  Trash2,
  Undo2,
  X,
} from "lucide-react";

import { BrandMark } from "@/components/layout/brand-mark";
import type { Device } from "@/lib/builder/types";
import { useBuilder } from "@/lib/hooks/use-builder";
import { cn } from "@/lib/utils";

import { Inspector } from "./inspector";
import { LeftPanel } from "./left-panel";
import { NodeView } from "./node-view";

/** The three widths the canvas previews, and what each one stands for. */
const DEVICES: { value: Device; icon: typeof Monitor; width: number }[] = [
  { value: "desktop", icon: Monitor, width: 1180 },
  { value: "tablet", icon: Tablet, width: 780 },
  { value: "mobile", icon: Smartphone, width: 390 },
];

/**
 * The Builder.
 *
 * Three columns and a bar, which is the arrangement every canvas editor has
 * converged on for a reason: the document on the left, the thing itself in the
 * middle, its properties on the right, and the verbs across the top. Nobody has to
 * learn where anything is.
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

  const device = DEVICES.find((entry) => entry.value === builder.device);
  const node = builder.selected;

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
      {/* The bar. Identity and the document on the left, the canvas controls in
          the middle, the way out on the right. */}
      <header className="flex shrink-0 items-center gap-3 bg-bg px-3 py-2">
        <div className="flex shrink-0 items-center gap-2.5">
          <BrandMark />
          <span className="hidden font-mono text-[9.5px] font-bold tracking-[0.14em] text-faint uppercase tabular-nums sm:inline">
            Builder {builder.count}
          </span>
        </div>

        <div className="ml-2 flex shrink-0 items-center gap-0.5">
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
          <BarButton icon={RotateCcw} label="Start again" onClick={builder.reset} />
        </div>

        <div className="mx-auto flex shrink-0 items-center gap-0.5 rounded-[8px] bg-panel-bg p-0.5">
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

        <button
          type="button"
          onClick={() => setShowCode(true)}
          className="flex shrink-0 items-center gap-1.5 rounded-btn-sm bg-ink px-3.5 py-2 text-[12px] font-bold text-white transition-opacity hover:opacity-85"
        >
          <Download aria-hidden className="size-3.5" />
          Export
        </button>
      </header>

      <div className="flex min-h-0 flex-1 gap-2 p-2 pt-0">
        <aside className="hidden w-[232px] shrink-0 flex-col rounded-card bg-bg lg:flex">
          <LeftPanel builder={builder} />
        </aside>

        {/* The canvas column. The breadcrumb sits above it rather than floating on
            it, so it never covers the thing it is describing. */}
        <div className="flex min-w-0 flex-1 flex-col rounded-card bg-bg">
          <div className="flex shrink-0 items-center gap-1.5 px-3 py-2.5">
            <nav aria-label="Selection path" className="flex min-w-0 items-center gap-1">
              {builder.path.length ? (
                builder.path.map((entry, at) => (
                  <span key={entry.id} className="flex min-w-0 items-center gap-1">
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
                        "truncate rounded-[5px] px-1.5 py-0.5 font-mono text-[9.5px] font-bold tracking-[0.08em] uppercase transition-colors",
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
                <span className="px-1.5 font-mono text-[9.5px] tracking-[0.08em] text-faint uppercase">
                  Click anything to select it
                </span>
              )}
            </nav>

            {/* The node's own verbs, beside its name rather than floating over the
                canvas: a toolbar that hovers on the selection covers whatever sits
                above it, which on a tight layout is the thing you are aligning to. */}
            {node ? (
              <div className="ml-auto flex shrink-0 items-center gap-0.5">
                <BarButton
                  icon={Plus}
                  label="Add inside"
                  onClick={() => builder.add("container")}
                />
                <BarButton
                  icon={Group}
                  label="Wrap in a container"
                  onClick={() => builder.wrap(node.id)}
                  disabled={node.id === builder.root.id}
                />
                <BarButton
                  icon={Copy}
                  label="Duplicate"
                  onClick={() => builder.duplicate(node.id)}
                  disabled={node.id === builder.root.id}
                />
                <BarButton
                  icon={Trash2}
                  label="Delete"
                  onClick={() => builder.remove(node.id)}
                  disabled={node.id === builder.root.id}
                  danger
                />
                <button
                  type="button"
                  onClick={() => builder.select(null)}
                  className="ml-1 flex items-center gap-1 rounded-[6px] px-2 py-1 font-mono text-[9px] font-bold tracking-[0.1em] text-faint uppercase transition-colors hover:text-ink"
                >
                  <X aria-hidden className="size-2.5" />
                  Deselect
                </button>
              </div>
            ) : null}
          </div>

          {/* Clicking the mat deselects. A canvas you cannot click out of feels
              stuck the first time you try. */}
          <div
            className="panel-scroll min-h-0 flex-1 overflow-auto bg-panel-bg/60 p-6"
            onClick={() => builder.select(null)}
          >
            <div
              className="mx-auto bg-white transition-[max-width] duration-300 ease-[var(--ease-out-soft)]"
              style={{ maxWidth: device?.width }}
            >
              <NodeView node={builder.root} builder={builder} />
            </div>
          </div>
        </div>

        <aside className="hidden w-[268px] shrink-0 flex-col rounded-card bg-bg xl:flex">
          <Inspector builder={builder} />
        </aside>
      </div>

      {showCode ? (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-ink/25 p-4 backdrop-blur-[2px]"
          onClick={() => setShowCode(false)}
        >
          <div
            className="flex max-h-[80vh] w-full max-w-[720px] flex-col rounded-card bg-bg p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[9px] font-bold tracking-[0.14em] text-brand uppercase">
                  Export
                </p>
                <h2 className="mt-1 text-[16px] font-extrabold tracking-[-0.01em]">
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
}: {
  icon: typeof Undo2;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        "flex size-7 items-center justify-center rounded-[6px] text-faint transition-colors disabled:pointer-events-none disabled:opacity-30",
        danger ? "hover:bg-destructive/10 hover:text-destructive" : "hover:bg-panel-bg hover:text-ink",
      )}
    >
      <Icon className="size-3.5" />
    </button>
  );
}
