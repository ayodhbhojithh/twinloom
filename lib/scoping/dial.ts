import { effortRag, RAG_COLOUR } from "./effort";
import { sectionSummary } from "./derive";
import { STEPS } from "./steps";
import type { ScopeAnswers } from "./types";

/* ---------------------------------------------------------------------------
   The effort dial, as data.

   Three rings, from TCT_Scope_Spec.md §2:
     inner   one segment per section
     middle  one per answered question inside that section
     outer   one per component chosen inside that question

   Colour is effort, grey is nothing answered yet. Everything here is pure: the
   SVG component just maps over what this returns, which keeps the geometry
   testable and the component dumb.
--------------------------------------------------------------------------- */

const CENTRE = 130;
export const DIAL_VIEWBOX = 260;
export const HUB_RADIUS = 44;

/** Inner and outer radius per ring. */
const RINGS: [number, number][] = [
  [46, 72],
  [77, 97],
  [101, 123],
];

/** Degrees of clear air between one section and the next. */
const SECTION_GAP = 2.4;
const UNIT_GAP = 0.6;
const OPTION_GAP = 0.5;

function polar(radius: number, degrees: number): [number, number] {
  const radians = ((degrees - 90) * Math.PI) / 180;
  return [
    CENTRE + radius * Math.cos(radians),
    CENTRE + radius * Math.sin(radians),
  ];
}

/** An annular segment: out along the outer arc, in, back along the inner arc. */
function segmentPath(
  innerRadius: number,
  outerRadius: number,
  from: number,
  to: number,
): string {
  if (to <= from) return "";

  const [x1, y1] = polar(outerRadius, to);
  const [x2, y2] = polar(outerRadius, from);
  const [x3, y3] = polar(innerRadius, from);
  const [x4, y4] = polar(innerRadius, to);
  const large = to - from <= 180 ? 0 : 1;

  return [
    `M${x1} ${y1}`,
    `A${outerRadius} ${outerRadius} 0 ${large} 0 ${x2} ${y2}`,
    `L${x3} ${y3}`,
    `A${innerRadius} ${innerRadius} 0 ${large} 1 ${x4} ${y4}`,
    "Z",
  ].join(" ");
}

export interface DialSegment {
  id: string;
  d: string;
  fill: string;
  opacity: number;
  strokeWidth: number;
  title: string;
  /** Set on the inner ring, which is the clickable one. */
  stepIndex?: number;
}

export function buildDial(
  answers: ScopeAnswers,
  current: number,
  complete: (index: number) => boolean,
): DialSegment[] {
  const segments: DialSegment[] = [];
  const arc = 360 / STEPS.length;

  STEPS.forEach((step, index) => {
    const from = index * arc + SECTION_GAP / 2;
    const to = (index + 1) * arc - SECTION_GAP / 2;

    const summary = sectionSummary(index, answers);
    const focused = index === current;
    const done = complete(index);

    /* The section itself: its own effort once it is complete, otherwise grey,
       and a lighter grey again if it is not even the section being looked at. */
    const fill = done
      ? summary.effort !== null
        ? RAG_COLOUR[effortRag(summary.effort)]
        : RAG_COLOUR.todo
      : focused
        ? "var(--color-faint)"
        : RAG_COLOUR.todo;

    segments.push({
      id: `section-${step.key}`,
      d: segmentPath(RINGS[0][0], RINGS[0][1], from, to),
      fill,
      opacity: done || focused ? 1 : 0.75,
      strokeWidth: 1.5,
      title: `${index + 1}. ${step.kicker}`,
      stepIndex: index,
    });

    /* Anything not being looked at fades back, so the eye lands on the section
       in play without the rest disappearing. */
    const opacity = focused ? 1 : 0.42;

    if (!summary.units.length) {
      segments.push({
        id: `unit-empty-${step.key}`,
        d: segmentPath(RINGS[1][0], RINGS[1][1], from, to),
        fill: RAG_COLOUR.todo,
        opacity: focused ? 0.6 : 0.3,
        strokeWidth: 1,
        title: `${step.kicker}: nothing answered yet`,
      });
      segments.push({
        id: `option-empty-${step.key}`,
        d: segmentPath(RINGS[2][0], RINGS[2][1], from, to),
        fill: RAG_COLOUR.todo,
        opacity: focused ? 0.45 : 0.25,
        strokeWidth: 1,
        title: `${step.kicker}: nothing answered yet`,
      });
      return;
    }

    const unitArc = (to - from) / summary.units.length;

    summary.units.forEach((unit, unitIndex) => {
      const unitFrom = from + unitIndex * unitArc;
      const unitTo = from + (unitIndex + 1) * unitArc;

      segments.push({
        id: `unit-${step.key}-${unitIndex}`,
        d: segmentPath(
          RINGS[1][0],
          RINGS[1][1],
          unitFrom + UNIT_GAP,
          unitTo - UNIT_GAP,
        ),
        fill: RAG_COLOUR[effortRag(unit.effort)],
        opacity,
        strokeWidth: 1,
        title: unit.label,
        stepIndex: index,
      });

      const optionArc = (unitTo - unitFrom) / unit.options.length;

      unit.options.forEach((option, optionIndex) => {
        const optionFrom = unitFrom + optionIndex * optionArc;
        const optionTo = unitFrom + (optionIndex + 1) * optionArc;

        segments.push({
          id: `option-${step.key}-${unitIndex}-${optionIndex}`,
          d: segmentPath(
            RINGS[2][0],
            RINGS[2][1],
            optionFrom + OPTION_GAP,
            optionTo - OPTION_GAP,
          ),
          fill: RAG_COLOUR[effortRag(option.effort)],
          opacity,
          strokeWidth: 0.8,
          title: `${option.label}, effort ${Math.round(option.effort)} out of 10`,
        });
      });
    });
  });

  return segments;
}
