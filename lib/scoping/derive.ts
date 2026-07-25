import { dialEffort, mean, optionEffort } from "./effort";
import { ASSETS, STEPS } from "./steps";
import type {
  ScopeAnswers,
  ScopeGroup,
  ScopeOption,
  ScopeStep,
  SectionSummary,
} from "./types";

/** Whether a conditional section applies yet. */
export function conditionMet(step: ScopeStep, answers: ScopeAnswers): boolean {
  if (!step.condition) return true;
  return (answers.multi[step.condition.key] ?? []).includes(step.condition.value);
}

/** Whether the redesign deepen block is showing. */
export function deepenActive(step: ScopeStep, answers: ScopeAnswers): boolean {
  if (!step.deepen) return false;
  return answers.single[step.deepen.when.key] === step.deepen.when.value;
}

/** Everything chosen in one group, in the order the options are declared. */
export function selectedOptions(
  group: ScopeGroup,
  answers: ScopeAnswers,
): ScopeOption[] {
  if (group.type === "single") {
    const value = answers.single[group.key];
    const option = group.options.find((entry) => entry.value === value);
    return option ? [option] : [];
  }

  const values = answers.multi[group.key] ?? [];
  return group.options.filter((option) => values.includes(option.value));
}

/** Finds an option anywhere in the journey, for the focus panel. */
export function findOption(
  groupKey: string,
  optionValue: string,
): { group: ScopeGroup; option: ScopeOption } | null {
  for (const step of STEPS) {
    for (const group of step.groups ?? []) {
      if (group.key !== groupKey) continue;

      const option = group.options.find((entry) => entry.value === optionValue);
      if (option) return { group, option };
    }
  }

  return null;
}

/**
 * What one section contributes: a unit per answered question, and the mean effort
 * across everything chosen in it.
 *
 * This is the single source for the dial's middle and outer rings and for the
 * readout, so the two can never tell different stories.
 */
export function sectionSummary(
  index: number,
  answers: ScopeAnswers,
): SectionSummary {
  const step = STEPS[index];
  const units: SectionSummary["units"] = [];

  if (step.special === "assets") {
    /* A missing asset is something we have to provide, so it costs more effort
       than one that already exists. */
    const options = ASSETS.map((asset, key) => {
      const state = answers.assets[key];
      if (!state) return null;
      return { label: asset, effort: state === "yes" ? 2 : 6 };
    }).filter(Boolean) as { label: string; effort: number }[];

    if (options.length) {
      units.push({
        label: "Your assets",
        options,
        effort: mean(options.map((option) => option.effort)),
      });
    }
  } else {
    for (const group of step.groups ?? []) {
      const chosen = selectedOptions(group, answers);
      if (!chosen.length) continue;

      const options = chosen.map((option) => ({
        label: option.label,
        effort: optionEffort(answers, group.key, option),
      }));

      units.push({
        label: group.question.replace(/\?$/, ""),
        options,
        effort: mean(options.map((option) => option.effort)),
      });
    }

    if (deepenActive(step, answers) && step.deepen) {
      for (const dial of step.deepen.dials) {
        /* Only dials the client has actually moved. An untouched dial at zero is
           not an answer, it is an absence. */
        if (!answers.touched.includes(`d:${dial.key}`)) continue;

        const effort = dialEffort(answers, dial.key);
        units.push({
          label: dial.label,
          options: [{ label: `${effort} out of 10`, effort }],
          effort,
        });
      }
    }

    if (step.special === "budget") {
      units.push({
        label: "Budget",
        options: [
          {
            label:
              answers.budget === null
                ? "Rather not say"
                : `£${answers.budget.toLocaleString("en-GB")}`,
            effort: 2,
          },
        ],
        effort: 2,
      });
    }

    if (step.special === "free" && answers.free.trim()) {
      units.push({
        label: "Notes",
        options: [{ label: "Added", effort: 2 }],
        effort: 2,
      });
    }
  }

  const everything = units.flatMap((unit) =>
    unit.options.map((option) => option.effort),
  );

  return { units, effort: everything.length ? mean(everything) : null };
}

/** Mean effort across every visited section that has an answer in it. */
export function overallEffort(
  answers: ScopeAnswers,
  visited: number[],
): number | null {
  const efforts = visited
    .map((index) => sectionSummary(index, answers).effort)
    .filter((effort): effort is number => effort !== null);

  return efforts.length ? mean(efforts) : null;
}

/**
 * A section counts as complete once it has been visited and has something in it.
 * Visiting alone is not enough: the dial would go green on a section the client
 * skipped past.
 */
export function isComplete(
  index: number,
  answers: ScopeAnswers,
  visited: number[],
): boolean {
  if (!visited.includes(index)) return false;

  const step = STEPS[index];
  /* A conditional section that does not apply is complete by not applying. */
  if (!conditionMet(step, answers)) return true;

  return sectionSummary(index, answers).units.length > 0;
}
