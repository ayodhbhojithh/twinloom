"use client";

import { useCallback, useMemo, useState } from "react";

import {
  conditionMet,
  deepenActive,
  findOption,
  isComplete,
  optionKey,
  overallEffort,
  sectionSummary,
  STEP_COUNT,
  STEPS,
  type AssetState,
  type ScopeAnswers,
  type ScopeStep,
  type SectionSummary,
} from "@/lib/scoping";

const EMPTY: ScopeAnswers = {
  single: {},
  multi: {},
  effort: {},
  touched: [],
  assets: {},
  budget: 5000,
  free: "",
};

/** Group key and option value, joined. Identifies what the focus panel shows. */
export type FocusKey = string | null;

export interface ScopingController {
  answers: ScopeAnswers;

  index: number;
  step: ScopeStep;
  isFirst: boolean;
  isLast: boolean;
  /** Sections the client has landed on. Drives completeness with the answers. */
  visited: number[];

  goTo: (index: number) => void;
  next: () => void;
  back: () => void;

  /** What the focus panel is showing, as `group:option`. */
  focus: FocusKey;
  setFocus: (focus: FocusKey) => void;

  isChosen: (groupKey: string, optionValue: string, type: "single" | "multi") => boolean;
  choose: (groupKey: string, optionValue: string, type: "single" | "multi") => void;

  setEffort: (key: string, effort: number) => void;
  isTouched: (key: string) => boolean;

  setAsset: (index: number, state: AssetState) => void;
  setBudget: (budget: number | null) => void;
  setFree: (free: string) => void;

  /** Whether this step applies at all. Selling only applies to a shop. */
  applies: boolean;
  deepen: boolean;

  summary: SectionSummary;
  completeCount: number;
  percent: number;
  overall: number | null;
  complete: (index: number) => boolean;
}

/**
 * The scoping session.
 *
 * Held in component state rather than the session store: the journey is one
 * sitting, and the answers only need to outlive it once they are posted to the
 * server. Wiring persistence in later is one call site.
 */
export function useScoping(): ScopingController {
  const [answers, setAnswers] = useState<ScopeAnswers>(EMPTY);
  const [index, setIndex] = useState(0);
  const [visited, setVisited] = useState<number[]>([0]);
  const [focus, setFocus] = useState<FocusKey>(null);

  const step = STEPS[index];

  const goTo = useCallback((next: number) => {
    const clamped = Math.max(0, Math.min(STEP_COUNT - 1, next));
    setIndex(clamped);
    setFocus(null);
    setVisited((current) =>
      current.includes(clamped) ? current : [...current, clamped],
    );
  }, []);

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const back = useCallback(() => goTo(index - 1), [goTo, index]);

  const isChosen = useCallback(
    (groupKey: string, optionValue: string, type: "single" | "multi") =>
      type === "single"
        ? answers.single[groupKey] === optionValue
        : (answers.multi[groupKey] ?? []).includes(optionValue),
    [answers],
  );

  /**
   * Clicking an option both chooses it and focuses it. Clicking one that is
   * already chosen but not focused only focuses it, so reading what something
   * means never costs you the answer.
   *
   * Not everything that calls this is a question in the list, though. The focus
   * panel has controls of its own, and those must not steal the focus that is
   * keeping the panel open, or it closes the moment you use it. `findOption` only
   * knows about the eight sections' own groups, so anything it cannot place is a
   * control inside a panel and is left to just toggle.
   */
  const choose = useCallback(
    (groupKey: string, optionValue: string, type: "single" | "multi") => {
      const key = `${groupKey}:${optionValue}`;
      const focusable = findOption(groupKey, optionValue) !== null;
      const chosen =
        type === "single"
          ? answers.single[groupKey] === optionValue
          : (answers.multi[groupKey] ?? []).includes(optionValue);

      if (focusable && chosen && focus !== key) {
        setFocus(key);
        return;
      }

      setAnswers((current) => {
        if (type === "single") {
          const single = { ...current.single };
          if (single[groupKey] === optionValue) delete single[groupKey];
          else single[groupKey] = optionValue;
          return { ...current, single };
        }

        const values = current.multi[groupKey] ?? [];
        const multi = {
          ...current.multi,
          [groupKey]: values.includes(optionValue)
            ? values.filter((value) => value !== optionValue)
            : [...values, optionValue],
        };
        return { ...current, multi };
      });

      /* Focus follows the selection: on when it goes on, cleared when it comes
         back off. */
      if (focusable) setFocus(chosen ? null : key);
    },
    [answers, focus],
  );

  const setEffort = useCallback((key: string, effort: number) => {
    setAnswers((current) => ({
      ...current,
      effort: { ...current.effort, [key]: effort },
      touched: current.touched.includes(key)
        ? current.touched
        : [...current.touched, key],
    }));
  }, []);

  const isTouched = useCallback(
    (key: string) => answers.touched.includes(key),
    [answers.touched],
  );

  const setAsset = useCallback((asset: number, state: AssetState) => {
    setAnswers((current) => ({
      ...current,
      assets: { ...current.assets, [asset]: state },
    }));
  }, []);

  const setBudget = useCallback((budget: number | null) => {
    setAnswers((current) => ({ ...current, budget }));
  }, []);

  const setFree = useCallback((free: string) => {
    setAnswers((current) => ({ ...current, free }));
  }, []);

  const complete = useCallback(
    (at: number) => isComplete(at, answers, visited),
    [answers, visited],
  );

  const summary = useMemo(() => sectionSummary(index, answers), [index, answers]);

  const completeCount = useMemo(
    () =>
      STEPS.reduce(
        (total, _, at) => total + (isComplete(at, answers, visited) ? 1 : 0),
        0,
      ),
    [answers, visited],
  );

  const overall = useMemo(
    () => overallEffort(answers, visited),
    [answers, visited],
  );

  return {
    answers,
    index,
    step,
    isFirst: index === 0,
    isLast: index === STEP_COUNT - 1,
    visited,
    goTo,
    next,
    back,
    focus,
    setFocus,
    isChosen,
    choose,
    setEffort,
    isTouched,
    setAsset,
    setBudget,
    setFree,
    applies: conditionMet(step, answers),
    deepen: deepenActive(step, answers),
    summary,
    completeCount,
    percent: Math.round((completeCount / STEP_COUNT) * 100),
    overall,
    complete,
  };
}

export { optionKey };
