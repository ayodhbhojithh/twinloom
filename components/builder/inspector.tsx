"use client";

import { useState } from "react";

import {
  ALIGN,
  BG,
  DIRECTION,
  JUSTIFY,
  MAX_WIDTH,
  RADIUS,
  SHADOW,
  SIZE,
  SPACE_STEPS,
  TEXT_ALIGN,
  TONE,
  WEIGHT,
  WIDTH,
} from "@/lib/builder/tokens";
import { isContainer } from "@/lib/builder/tree";
import type { BuilderNode } from "@/lib/builder/types";
import type { BuilderController } from "@/lib/hooks/use-builder";
import { cn } from "@/lib/utils";

import { Field, Segments, Stepper, Swatches, Toggle } from "./controls";

const TABS = ["Style", "Layout", "Spacing"] as const;
type Tab = (typeof TABS)[number];

const SIDES = [
  { key: "t", label: "Top" },
  { key: "r", label: "Right" },
  { key: "b", label: "Bottom" },
  { key: "l", label: "Left" },
] as const;

const opts = <T extends string>(scale: { value: T; label: string }[]) =>
  scale.map((entry) => ({ value: entry.value, label: entry.label }));

/**
 * The right hand panel: everything about the selected node, in three tabs.
 *
 * Split by what you are thinking about rather than by what the CSS is called.
 * Style is how it looks, Layout is how it arranges what is inside it, Spacing is
 * how much room it takes. A visitor looking for padding never has to wonder
 * whether it counts as style.
 *
 * Layout only appears for the kinds that can hold children, because alignment on a
 * heading is a control that does nothing, and a control that does nothing is worse
 * than an absent one.
 */
export function Inspector({ builder }: { builder: BuilderController }) {
  const [tab, setTab] = useState<Tab>("Style");
  const node = builder.selected;

  if (!node) {
    return (
      <div className="px-4 py-6">
        <p className="font-mono text-[9px] font-bold tracking-[0.14em] text-faint uppercase">
          Nothing selected
        </p>
        <p className="mt-2.5 text-[12px] leading-[1.6] text-body">
          Click anything on the canvas to style it. Everything you change here is
          written into the code you export.
        </p>

        <dl className="mt-5 flex flex-col gap-2">
          {[
            ["Undo, redo", "Cmd Z, Shift Cmd Z"],
            ["Duplicate", "Cmd D"],
            ["Delete", "Backspace"],
            ["Walk siblings", "Up, Down"],
            ["Reorder", "Alt Up, Alt Down"],
            ["Deselect", "Esc"],
          ].map(([what, keys]) => (
            <div
              key={what}
              className="flex items-baseline justify-between gap-3 text-[11.5px]"
            >
              <dt className="text-body">{what}</dt>
              <dd className="font-mono text-[9.5px] tracking-[0.06em] text-faint uppercase">
                {keys}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }

  /* Layout is only offered for the kinds that can hold children: alignment on a
     heading is a control that does nothing. When the selection changes to one of
     those, the tab falls back rather than showing an empty pane. */
  const tabs: Tab[] = isContainer(node.kind)
    ? [...TABS]
    : TABS.filter((entry) => entry !== "Layout");
  const active: Tab = tabs.includes(tab) ? tab : "Style";

  return (
    <>
      <div className="px-4 pt-4">
        <p className="font-mono text-[9px] font-bold tracking-[0.14em] text-brand uppercase">
          {node.kind}
        </p>
        <h2 className="mt-1 truncate text-[15px] font-extrabold tracking-[-0.01em]">
          {node.content?.trim() || node.kind}
        </h2>
      </div>

      <div className="mt-3 flex gap-0.5 px-4">
        {tabs.map((entry) => (
          <button
            key={entry}
            type="button"
            onClick={() => setTab(entry)}
            className={cn(
              "flex-1 rounded-[6px] py-1.5 font-mono text-[9px] font-bold tracking-[0.12em] uppercase transition-colors",
              entry === active
                ? "bg-brand text-white"
                : "text-faint hover:text-ink",
            )}
          >
            {entry}
          </button>
        ))}
      </div>

      <div className="panel-scroll min-h-0 flex-1 overflow-y-auto px-4 pt-5 pb-8">
        {active === "Style" ? <StyleTab node={node} builder={builder} /> : null}
        {active === "Layout" ? <LayoutTab node={node} builder={builder} /> : null}
        {active === "Spacing" ? (
          <SpacingTab node={node} builder={builder} />
        ) : null}
      </div>
    </>
  );
}

function StyleTab({
  node,
  builder,
}: {
  node: BuilderNode;
  builder: BuilderController;
}) {
  const { setStyle, setText } = builder;
  const textish = node.content !== undefined;

  return (
    <div className="flex flex-col gap-6">
      <Field label="Background">
        <Swatches
          options={BG.map((entry) => ({
            value: entry.value,
            css: entry.css,
            label: entry.label,
          }))}
          value={node.style.bg}
          onChange={(value) => setStyle(node.id, { bg: value as never })}
        />
      </Field>

      <Field label="Corner radius">
        <Segments
          compact
          options={opts(RADIUS)}
          value={node.style.radius}
          onChange={(value) => setStyle(node.id, { radius: value })}
        />
      </Field>

      <Field label="Shadow">
        <Segments
          compact
          options={opts(SHADOW)}
          value={node.style.shadow}
          onChange={(value) => setStyle(node.id, { shadow: value })}
        />
      </Field>

      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[9px] font-bold tracking-[0.14em] text-faint uppercase">
          Hairline border
        </p>
        <Toggle
          on={node.style.border}
          label="Hairline border"
          onChange={(on) => setStyle(node.id, { border: on })}
        />
      </div>

      <Field label="Opacity" hint={`${node.style.opacity}%`}>
        <input
          type="range"
          min={10}
          max={100}
          step={5}
          value={node.style.opacity}
          aria-label="Opacity"
          onChange={(event) =>
            setStyle(node.id, { opacity: Number(event.target.value) })
          }
          className="h-1.5 w-full appearance-none rounded-pill bg-line accent-brand"
        />
      </Field>

      <Field label="Width">
        <Segments
          options={opts(WIDTH)}
          value={node.style.width}
          onChange={(value) => setStyle(node.id, { width: value })}
        />
      </Field>

      <Field label="Max width">
        <Segments
          compact
          options={opts(MAX_WIDTH)}
          value={node.style.maxWidth}
          onChange={(value) => setStyle(node.id, { maxWidth: value })}
        />
      </Field>

      {textish ? (
        <>
          <Field label="Text size">
            <Segments
              compact
              options={opts(SIZE)}
              value={node.text.size}
              onChange={(value) => setText(node.id, { size: value })}
            />
          </Field>

          <Field label="Weight">
            <Segments
              compact
              options={opts(WEIGHT)}
              value={node.text.weight}
              onChange={(value) => setText(node.id, { weight: value })}
            />
          </Field>

          <Field label="Text colour">
            <Swatches
              options={TONE.map((entry) => ({
                value: entry.value,
                css: entry.css,
                label: entry.label,
              }))}
              value={node.text.tone}
              onChange={(value) => setText(node.id, { tone: value as never })}
            />
          </Field>

          <Field label="Text align">
            <Segments
              options={opts(TEXT_ALIGN)}
              value={node.text.align}
              onChange={(value) => setText(node.id, { align: value })}
            />
          </Field>
        </>
      ) : null}
    </div>
  );
}

function LayoutTab({
  node,
  builder,
}: {
  node: BuilderNode;
  builder: BuilderController;
}) {
  const { setLayout } = builder;

  return (
    <div className="flex flex-col gap-6">
      {node.kind === "grid" ? (
        <Field label="Columns" hint={`${node.layout.columns}`}>
          <Stepper
            label="columns"
            value={node.layout.columns}
            scale={[1, 2, 3, 4, 5, 6]}
            onChange={(columns) => setLayout(node.id, { columns })}
          />
        </Field>
      ) : (
        <>
          <Field label="Direction">
            <Segments
              options={opts(DIRECTION)}
              value={node.layout.direction}
              onChange={(value) => setLayout(node.id, { direction: value })}
            />
          </Field>

          <Field label="Align">
            <Segments
              compact
              options={opts(ALIGN)}
              value={node.layout.align}
              onChange={(value) => setLayout(node.id, { align: value })}
            />
          </Field>

          <Field label="Distribute">
            <Segments
              compact
              options={opts(JUSTIFY)}
              value={node.layout.justify}
              onChange={(value) => setLayout(node.id, { justify: value })}
            />
          </Field>

          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-[9px] font-bold tracking-[0.14em] text-faint uppercase">
              Wrap
            </p>
            <Toggle
              on={node.layout.wrap}
              label="Wrap"
              onChange={(wrap) => setLayout(node.id, { wrap })}
            />
          </div>
        </>
      )}

      <Field label="Gap" hint={`${node.layout.gap * 4}px`}>
        <Stepper
          label="gap"
          value={node.layout.gap}
          scale={SPACE_STEPS}
          onChange={(gap) => setLayout(node.id, { gap })}
        />
      </Field>
    </div>
  );
}

function SpacingTab({
  node,
  builder,
}: {
  node: BuilderNode;
  builder: BuilderController;
}) {
  const { setPad, setMargin } = builder;

  return (
    <div className="flex flex-col gap-7">
      <div>
        <p className="font-mono text-[9px] font-bold tracking-[0.14em] text-faint uppercase">
          Padding
        </p>
        <p className="mt-1 text-[11px] text-faint">Inside the box.</p>

        <div className="mt-3 flex flex-col gap-2">
          {SIDES.map((side) => (
            <div
              key={side.key}
              className="flex items-center justify-between gap-3"
            >
              <span className="text-[11.5px] font-semibold text-body">
                {side.label}
              </span>
              <Stepper
                label={`${side.label} padding`}
                value={node.pad[side.key]}
                scale={SPACE_STEPS}
                onChange={(value) => setPad(node.id, side.key, value)}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="font-mono text-[9px] font-bold tracking-[0.14em] text-faint uppercase">
          Margin
        </p>
        <p className="mt-1 text-[11px] text-faint">Outside the box.</p>

        <div className="mt-3 flex flex-col gap-2">
          {SIDES.map((side) => (
            <div
              key={side.key}
              className="flex items-center justify-between gap-3"
            >
              <span className="text-[11.5px] font-semibold text-body">
                {side.label}
              </span>
              <Stepper
                label={`${side.label} margin`}
                value={node.margin[side.key]}
                scale={SPACE_STEPS}
                onChange={(value) => setMargin(node.id, side.key, value)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
