"use client";

import { useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";

import { ASSUMPTIONS, ORG_KINDS, STEPS } from "@/lib/build/v5";
import { asLink, isLink } from "@/lib/build/url";
import { STEP_COPY } from "@/lib/build/v5-copy";
import {
  addOwn,
  addRef,
  chipsIn,
  dropOwn,
  dropRefTied,
  type Answers,
  type Where,
} from "@/lib/build/v5-store";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   The vocabulary of the build screens.

   One file holding every small control the twelve steps are drawn with, in the
   landing page's own language: pills with a diagonal arrow, ticks in circles,
   ink on white, and one red mark for a thing that has been set. A step file
   should read as what it asks, not as how it is drawn, and a control defined
   twice is a control that disagrees with itself by the second edit.
--------------------------------------------------------------------------- */

export type StepState = "here" | "ahead" | "done" | "past";

/**
 * What has happened to a step.
 *
 * A tick is a claim that a step was answered, so `done` is only ever given to
 * one that was touched or has nothing to answer. A step walked past is `past`:
 * it becomes an assumption, not a hole and not a tick.
 */
export function stateOf(at: number, step: number, answers: Answers): StepState {
  if (at === step) return "here";
  if (at > step) return "ahead";
  const key = STEPS[at].k;
  return answers.touched[key] || !ASSUMPTIONS[key] ? "done" : "past";
}

/** The mono label everything quiet is written in. */
export function Kicker({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-mono text-[10px] font-bold tracking-[0.16em] text-label uppercase",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** The one question a step asks, at the landing page's weight. */
export function H({ children }: { children: React.ReactNode }) {
  return (
    /* Centred over what it introduces, not held to the left of it. `notch-free`
       is gone from the cap with it: that number is the room beside the top cut,
       which only matters to a heading standing in that corner. */
    <h2 className="mx-auto max-w-[26ch] text-center text-[clamp(20px,1.9vw,27px)] leading-[1.08] font-extrabold tracking-[-0.032em] text-ink max-sm:text-[18px]">
      {children}
    </h2>
  );
}

/** The one line under it. Anything longer belongs in the document, not here. */
export function Sub({ children }: { children: React.ReactNode }) {
  return (
    <p className="mx-auto mt-2 max-w-[62ch] text-center text-[13.5px] leading-[1.5] text-quiet max-sm:mt-1.5 max-sm:text-[12.5px] max-sm:leading-[1.55] sm:text-[14px]">
      {children}
    </p>
  );
}

/** A heading inside a step, for the second question on a screen that has two. */
export function SubTitle({
  children,
  count,
  className,
}: {
  children: React.ReactNode;
  count?: number | string;
  className?: string;
}) {
  return (
    <h3
      className={cn(
        "mt-9 flex items-baseline gap-2.5 text-[16.5px] leading-[1.2] font-bold tracking-[-0.02em] text-ink max-sm:mt-6 max-sm:text-[15px]",
        className,
      )}
    >
      {children}
      {count !== undefined ? (
        <span className="font-mono text-[10px] font-bold text-idx tabular-nums">
          {count}
        </span>
      ) : null}
    </h3>
  );
}

/** The landing page's pill, as a button. */
export function Pill({
  tone = "quiet",
  arrow,
  onClick,
  disabled,
  className,
  children,
}: {
  tone?: "quiet" | "ink";
  /** The diagonal arrow the home page puts on a way somewhere. */
  arrow?: boolean;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group/pill inline-flex cursor-pointer items-center gap-2 rounded-pill px-4.5 py-2 text-[14px] font-semibold transition-colors",
        tone === "ink"
          ? "bg-ink text-white hover:opacity-85"
          : "bg-well text-ink hover:bg-hair",
        disabled && "cursor-default bg-planned text-white hover:opacity-100",
        className,
      )}
    >
      {children}
      {arrow ? (
        <ArrowUpRight
          aria-hidden
          className="size-4 transition-transform group-hover/pill:translate-x-0.5 group-hover/pill:-translate-y-0.5"
        />
      ) : null}
    </button>
  );
}

/**
 * One answer among options: an outlined chip that fills ink when chosen.
 *
 * Ink rather than red, deliberately. Red marks set-membership - the things you
 * have added to your site. A chip is a choice between alternatives, and the
 * product-page convention the site follows fills those solid.
 */
export function Chip({
  on,
  onClick,
  small,
  title,
  children,
}: {
  on: boolean;
  onClick: () => void;
  small?: boolean;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      title={title}
      onClick={onClick}
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 rounded-pill border font-semibold transition-colors",
        small ? "px-2.5 py-1 text-[12px]" : "px-3.5 py-1.5 text-[13.5px]",
        on
          ? "border-ink bg-ink text-white"
          : "border-border bg-field text-body hover:border-quiet hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

/**
 * One answer, as a row you tick.
 *
 * A wrapped run of pills makes you read every one to find the two that are on;
 * a column of ticks shows you at a glance, and leaves each answer room to say
 * what it puts on the site without being shortened.
 */
export function TickRow({
  on,
  name,
  note,
  mark,
  single,
  locked,
  onToggle,
  className,
}: {
  on: boolean;
  name: string;
  /** What ticking it means, in a few words. */
  note?: string;
  /** The quiet fact at the end of the row: what it adds. */
  mark?: string;
  /** Drawn as a radio when only one of the set may be chosen. */
  single?: boolean;
  /** For the things that are on every site: ticked, and not a control. */
  locked?: boolean;
  onToggle?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      role={single ? "radio" : "checkbox"}
      aria-checked={on}
      aria-disabled={locked || undefined}
      onClick={locked ? undefined : onToggle}
      className={cn(
        /* Tighter on a phone, and the padding goes before the gap does.
           A row is a target as well as a line of type: the height it keeps is
           what a thumb aims at, and the 21px mark beside the words is most of
           what makes a set of these readable as a set. So the horizontal
           padding comes off, the vertical padding comes off a little, and the
           mark and the label step down one size each. */
        "group/tick flex w-full items-center gap-3.5 rounded-[12px] px-3 py-2.5 text-left transition-colors max-sm:gap-2.5 max-sm:rounded-[10px] max-sm:px-2 max-sm:py-2",
        locked ? "cursor-default" : "cursor-pointer hover:bg-canvas",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "flex size-[21px] flex-none items-center justify-center rounded-pill border-2 transition-colors max-sm:size-[18px]",
          on
            ? "border-mark bg-mark text-white"
            : "border-planned text-transparent",
          !on && !locked && "group-hover/tick:border-quiet",
        )}
      >
        {single ? (
          <span
            className={cn(
              "size-[7px] rounded-pill",
              on ? "bg-white" : "bg-transparent",
            )}
          />
        ) : (
          <Check className="size-[12px]" strokeWidth={3.2} />
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block text-[14.5px] leading-[1.25] font-semibold transition-colors max-sm:text-[13.5px]",
            on ? "text-ink" : "text-body",
          )}
        >
          {name}
        </span>
        {note ? (
          <span className="mt-0.5 block text-[12.5px] leading-[1.4] text-label max-sm:text-[12px]">
            {note}
          </span>
        ) : null}
      </span>

      {mark ? (
        <span
          className={cn(
            "flex-none font-mono text-[9px] font-bold tracking-[0.1em] uppercase transition-colors",
            on ? "text-mark" : "text-idx",
          )}
        >
          {mark}
        </span>
      ) : null}
    </button>
  );
}

/**
 * A promise to send something, recorded as one: pressing it puts a line on the
 * desk, pressing it again takes that line off.
 */
export function AttachChip({
  attach,
  answers,
  stepKey,
  where,
}: {
  attach: { key: string; label: string };
  answers: Answers;
  stepKey: string;
  where?: Where;
}) {
  const on = answers.refs.some((ref) => ref.tie === attach.key);

  return (
    <Chip
      small
      on={on}
      onClick={() => {
        if (on) {
          dropRefTied(attach.key);
          return;
        }
        addRef(
          {
            kind: "To send",
            text: attach.label,
            tie: attach.key,
            where: where ?? { stepKey },
          },
          stepKey,
        );
      }}
    >
      {attach.label}
    </Chip>
  );
}

/** A single-line field with its label and, where it earns one, its reason. */
export function Field({
  id,
  label,
  required,
  why,
  type = "text",
  value,
  placeholder,
  bad,
  onChange,
}: {
  id: string;
  label: string;
  required?: boolean;
  /** Why it is being asked, in a few words. */
  why?: string;
  type?: string;
  value: string;
  placeholder?: string;
  /**
   * Required, empty, and somebody has already pressed send.
   *
   * Not "empty": marking a field red before anybody has tried to submit tells
   * somebody they have done something wrong when all they have done is not
   * finished yet. It turns on at the first refusal and off the moment the
   * field is filled in.
   */
  bad?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div className="min-w-0">
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[13.5px] font-semibold text-ink">
          {label}
        </label>
        <Kicker
          className={bad ? "text-blocked" : required ? "text-mark" : undefined}
        >
          {required ? "Required" : "Optional"}
        </Kicker>
      </div>

      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder ?? label}
        aria-invalid={bad || undefined}
        aria-describedby={bad ? `${id}-bad` : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "h-9 w-full rounded-field border bg-field px-3.5 text-[14px] text-ink outline-none transition-colors placeholder:text-label",
          bad
            ? "border-blocked bg-blocked/[0.04] focus:border-blocked"
            : "border-border focus:border-ink",
        )}
      />

      {bad ? (
        <p
          id={`${id}-bad`}
          className="mt-1 text-[12px] leading-[1.4] font-semibold text-blocked"
        >
          {label} is needed before this can go.
        </p>
      ) : why ? (
        <p className="mt-1 text-[12px] leading-[1.4] text-label">{why}</p>
      ) : null}
    </div>
  );
}

/** A field with an Add beside it, for anything that grows a list. */
export function AddRow({
  placeholder,
  label,
  kind = "text",
  onAdd,
}: {
  placeholder: string;
  label?: string;
  /**
   * What is being collected.
   *
   * `url` reads what was typed as an address before handing it over, so a
   * website is stored as one rather than as a line of text wearing the label.
   * A bare `example.com` is filled out; anything that is not an address is
   * refused here rather than filed and found on the call.
   */
  kind?: "text" | "url";
  onAdd: (value: string) => void;
}) {
  const [draft, setDraft] = useState("");
  const [bad, setBad] = useState(false);

  return (
    <form
      className="flex flex-wrap items-center gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        const said = draft.trim();
        if (!said) return;

        if (kind === "url") {
          const link = asLink(said);
          if (!link) {
            setBad(true);
            return;
          }
          onAdd(link.href);
        } else {
          onAdd(said);
        }

        setDraft("");
        setBad(false);
      }}
    >
      <input
        value={draft}
        type={kind === "url" ? "url" : "text"}
        inputMode={kind === "url" ? "url" : undefined}
        autoComplete={kind === "url" ? "url" : undefined}
        spellCheck={kind === "url" ? false : undefined}
        aria-label={label ?? placeholder}
        aria-invalid={bad || undefined}
        placeholder={placeholder}
        onChange={(event) => {
          setDraft(event.target.value);
          if (bad) setBad(false);
        }}
        className={cn(
          "h-9 min-w-0 flex-1 rounded-field border bg-field px-3.5 text-[14px] text-ink outline-none transition-colors placeholder:text-label",
          bad ? "border-blocked" : "border-border focus:border-ink",
        )}
      />
      {/* No fill on it. An empty box has nothing to add, so a solid button
          beside it was a grey slab sitting there being ignored - and once there
          is something to add, the words are enough to say so. */}
      <button
        type="submit"
        disabled={!draft.trim()}
        className="h-9 flex-none cursor-pointer rounded-field px-3 text-[13.5px] font-semibold text-ink transition-colors hover:text-mark disabled:cursor-default disabled:text-planned"
      >
        Add
      </button>

      {bad ? (
        <p className="w-full text-[12px] leading-[1.5] text-blocked">
          That is not an address we can open. Try something like twinloom.com,
          or add it as a note instead.
        </p>
      ) : null}
    </form>
  );
}

/**
 * One line off the desk, rendered as what it is.
 *
 * A website opens; everything else is the words somebody wrote. Tested on the
 * stored line rather than on the label beside it, so a kind renamed in the
 * copy cannot turn addresses back into text.
 */
export function RefText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const link = isLink(text) ? asLink(text) : null;
  if (!link) return <>{text}</>;

  return (
    <a
      href={link.href}
      target="_blank"
      rel="noreferrer noopener"
      title={link.href}
      className={cn(
        "break-all underline decoration-hair underline-offset-2 transition-colors hover:text-mark hover:decoration-mark",
        className,
      )}
    >
      {link.label}
    </a>
  );
}

/**
 * Somewhere to say the thing the question did not ask.
 *
 * On every step and every card that has one in the source, because a list of
 * options is a list of our guesses and the one that matters is often not on it.
 */
export function OwnList({
  listId,
  label,
  placeholder,
  answers,
  stepKey,
}: {
  listId: string;
  label: string;
  placeholder: string;
  answers: Answers;
  stepKey: string;
}) {
  const said = answers.own[listId] ?? [];

  return (
    <div className="mt-7 mx-auto max-w-[560px]">
      <p className="mb-2 text-[13.5px] font-semibold text-ink">{label}</p>
      <AddRow
        placeholder={placeholder}
        onAdd={(value) => addOwn(listId, value, stepKey)}
      />

      {said.length ? (
        <ul className="mt-2.5 flex flex-col gap-1.5">
          {said.map((words, at) => (
            <li
              key={`${listId}-${at}`}
              className="flex items-center gap-3 rounded-field bg-field px-3.5 py-2"
            >
              <span
                aria-hidden
                className="size-1.5 flex-none rounded-pill bg-mark"
              />
              <span className="min-w-0 flex-1 text-[13.5px] leading-[1.4] text-ink">
                {words}
              </span>
              <button
                type="button"
                onClick={() => dropOwn(listId, at)}
                className="flex-none cursor-pointer font-mono text-[9px] font-bold tracking-[0.12em] text-label uppercase transition-colors hover:text-ink"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/** Every own-words box a step declares in the source, rendered from the data. */
export function Misses({ step, answers }: { step: string; answers: Answers }) {
  const copy = STEP_COPY[step];
  if (!copy?.miss.length) return null;

  return (
    <>
      {copy.miss.map((box) => (
        <OwnList
          key={box.id}
          listId={box.id}
          label={box.label}
          placeholder={box.ph}
          answers={answers}
          stepKey={step}
        />
      ))}
    </>
  );
}

/**
 * A set of answers as ticked rows rather than pills.
 *
 * The pill was the wrong shape for an answer. A wrapped run of them makes you
 * read every one to find the two that are on, and it forces each label to be
 * short enough to fit a tag - which is why half of them lost the words that
 * said what they meant. A column of ticks shows the set and its state in one
 * look, and gives every answer room to keep its own sentence.
 *
 * Two columns where there are more than four, which is the shape the reference
 * uses and the reason it stays readable at eleven options.
 */
export function TickSet({
  options,
  isOn,
  onPick,
  single,
  className,
}: {
  options: readonly {
    k: string;
    label: string;
    note?: string;
    mark?: string;
  }[];
  isOn: (k: string) => boolean;
  onPick: (k: string) => void;
  /** Drawn as radios when only one of the set may be chosen. */
  single?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mt-2 grid gap-x-6",
        options.length > 4 && "sm:grid-cols-2",
        className,
      )}
      role={single ? "radiogroup" : "group"}
    >
      {options.map((option) => (
        <TickRow
          key={option.k}
          single={single}
          on={isOn(option.k)}
          name={option.label}
          note={option.note}
          mark={option.mark}
          onToggle={() => onPick(option.k)}
        />
      ))}
    </div>
  );
}

/**
 * One answer on a row of its own, for the places where three answers have to
 * share a line with the thing they are answering about.
 *
 * The same mark as everywhere else, at the size a row can carry: a circle that
 * fills when set, and the label beside it. No border, no fill, no pill - it is
 * an answer, not a button.
 */
export function TickInline({
  on,
  label,
  onPick,
}: {
  on: boolean;
  label: string;
  onPick: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={on}
      onClick={onPick}
      className="group/inline flex cursor-pointer items-center gap-2 rounded-pill py-1 pr-2.5 pl-1 transition-colors hover:bg-well"
    >
      <span
        aria-hidden
        className={cn(
          "flex size-[17px] flex-none items-center justify-center rounded-pill border-2 transition-colors",
          on
            ? "border-mark bg-mark"
            : "border-planned group-hover/inline:border-quiet",
        )}
      >
        <span
          className={cn(
            "size-[5px] rounded-pill",
            on ? "bg-white" : "bg-transparent",
          )}
        />
      </span>
      <span
        className={cn(
          "text-[12.5px] leading-none font-semibold whitespace-nowrap transition-colors",
          on ? "text-ink" : "text-quiet",
        )}
      >
        {label}
      </span>
    </button>
  );
}

/**
 * What a step has had out of somebody, in its own terms.
 *
 * Not a percentage of a form. Each step counts the thing it actually asks
 * for - groups named, rows answered, fields filled - because "three of seven"
 * means something and "43%" does not.
 */
export function stepStatus(
  key: string,
  answers: Answers,
): { line: string; done: number; total: number } {
  const count = (scope: string) =>
    Object.values(answers.pick[scope] ?? {}).filter(Boolean).length;

  switch (key) {
    /* The first step, and it had no case at all.

       Its two questions write to `chip.orgkind` and `pick.sector`, and neither
       was read here - so the switch fell through to the default and the card for
       step one said "Ready when you are" however much had been answered on it.
       Somebody who chose their organisation and their trade watched the rail
       report that they had not started, which is the whole of what this function
       is for.

       Two things asked, so two out of two: the kind is named where it has been
       chosen, because a name is worth more than a count when there is only ever
       one of them. */
    case "org": {
      const kind = chipsIn(answers, "orgkind")[0];
      const fields = count("sector");
      const said = kind ? (ORG_KINDS[kind] ?? "Named") : "";

      return {
        line:
          said && fields
            ? `${said} · ${fields} field${fields > 1 ? "s" : ""}`
            : said ||
              (fields
                ? `${fields} field${fields > 1 ? "s" : ""}`
                : "Nothing yet"),
        done: (kind ? 1 : 0) + (fields ? 1 : 0),
        total: 2,
      };
    }
    case "arrive":
      return { line: "Nothing to answer", done: 0, total: 0 };
    case "layout": {
      const done = count("layout");
      return { line: done ? "Shape picked" : "Not picked yet", done, total: 1 };
    }
    case "who": {
      const done = count("who");
      return {
        line: done ? `${done} named` : "Nobody named yet",
        done,
        total: 7,
      };
    }
    case "do": {
      const done = count("do");
      return { line: done ? `${done} picked` : "Nothing yet", done, total: 28 };
    }
    case "sell": {
      const done = count("sell") + count("pay");
      return {
        line: done ? `${done} picked` : "Nothing sold here",
        done,
        total: 13,
      };
    }
    case "style": {
      const done =
        count("feel") + count("colour") + count("mode") + count("type");
      return {
        line: done ? `${done} chosen` : "Ours to choose",
        done,
        total: 17,
      };
    }
    case "have": {
      const done = Object.keys(answers.chip).filter(
        (q) =>
          q.startsWith("have.") && Object.values(answers.chip[q]).some(Boolean),
      ).length;
      return {
        line: done ? `${done} of 13 answered` : "Nothing yet",
        done,
        total: 13,
      };
    }
    case "refs": {
      const done = answers.refs.length;
      return {
        line: done ? `${done} on the desk` : "Nothing added",
        done,
        total: 0,
      };
    }
    case "read":
      return { line: "Everything, read back", done: 0, total: 0 };
    case "asking": {
      const done =
        ["name", "company", "email"].filter(
          (f) => (answers.ask[f] ?? "").length > 1,
        ).length +
        (Object.values(answers.chip["ask.part"] ?? {}).some(Boolean) ? 1 : 0);
      return { line: `${done} of 4 given`, done, total: 4 };
    }
    case "keep":
      return {
        line:
          answers.keep === null
            ? "Not asked yet"
            : answers.keep
              ? "Registered"
              : "Not registered",
        done: answers.keep === null ? 0 : 1,
        total: 1,
      };
    default:
      return {
        line: answers.sent ? "Sent" : "Ready when you are",
        done: 0,
        total: 0,
      };
  }
}
