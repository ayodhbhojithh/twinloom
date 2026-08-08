"use client";

import { useMemo, useState } from "react";
import { Check, Search } from "lucide-react";

import { ORG_KINDS, SECTORS, SECTOR_TAGS, TYPE_NAMES } from "@/lib/build/v5";
import { SYSTEM_LINKS } from "@/lib/build/v5-systems";
import {
  addOwn,
  chipOn,
  isOn,
  picked,
  toggleChip,
  togglePick,
  type Answers,
} from "@/lib/build/v5-store";
import { cn } from "@/lib/utils";

import { StageStep } from "./frame";
import { AddRow, H, Kicker, Sub, SubTitle, TickRow } from "./kit";

/* ---------------------------------------------------------------------------
   The three steps v5.4 added: the organisation, the working parts inside a
   page, and what the site has to join to.

   They sit in a file of their own for the same reason the others are split
   three ways: a file holding every screen is a file nobody can find anything
   in. What they share is that each asks about the business rather than about
   the website, which is the rule the whole run-through is built on.
--------------------------------------------------------------------------- */

type StepProps = {
  at: number;
  answers: Answers;
  onGo: (at: number) => void;
  onGoKey: (key: string) => void;
};

/* ------------------------------------------------------------------ 01 org */

/**
 * The industries, grouped as the prototype groups them.
 *
 * Built from the tag data rather than written out a second time, so a sector
 * that moves family moves in the picker as well. Fifty-five in one flat list is
 * a scroll; in thirteen families it is a glance.
 */
function sectorFamilies() {
  const families = new Map<string, { k: string; n: string }[]>();
  for (const [k, tag] of Object.entries(SECTOR_TAGS)) {
    const list = families.get(tag.g) ?? [];
    list.push({ k, n: tag.n });
    families.set(tag.g, list);
  }
  return [...families.entries()];
}

/**
 * Your organisation and industry.
 *
 * The first fork, and everything else on the build follows it: one site with
 * one identity, one site with a section each, and separate sites are three
 * different builds, whatever the words on them turn out to be.
 *
 * The industry is not a category for a form. It is what says the stock is
 * perishable, or the goods are oversized, or somebody is checking - before
 * anybody has had to explain it. So what a sector implies is shown back the
 * moment it is picked rather than filed away.
 */
export function StageOrg({ at, answers, onGo }: StepProps) {
  const [find, setFind] = useState("");
  const [family, setFamily] = useState<string | null>(null);
  const families = useMemo(() => sectorFamilies(), []);
  const chosen = picked(answers, "sector");

  const hunted = find.trim().toLowerCase();

  /* Fifty-five rows, shown a family at a time.

     All of them at once is not a choice, it is a wall: thirteen headings and
     fifty-five radio buttons, of which fifty-four are wrong for everybody. So
     the families come first - thirteen words, which is a glance - and one of
     them opens its own rows. Searching skips the whole arrangement, because
     somebody who knows their trade should be able to type it.

     Anything already chosen stays visible whatever else is showing. A picker
     that hides the answer you gave it is asking you to trust it. */
  const shown = hunted
    ? families
        .map(
          ([name, rows]) =>
            [
              name,
              rows.filter(
                (row) =>
                  row.n.toLowerCase().includes(hunted) ||
                  name.toLowerCase().includes(hunted),
              ),
            ] as const,
        )
        .filter(([, rows]) => rows.length)
    : families.filter(
        ([name, rows]) =>
          name === family || rows.some((row) => isOn(answers, "sector", row.k)),
      );

  return (
    <StageStep at={at} answers={answers} onGo={onGo}>
      <H>What kind of organisation is this?</H>
      <Sub>
        Everything else on the build follows this one. One site with one
        identity, one site with a section each, and separate sites are three
        different builds, and the argument about who updates what arrives either
        way.
      </Sub>

      <section className="mt-6 mx-auto max-w-[1100px]">
        <div className="grid gap-x-6 sm:grid-cols-2">
          {Object.entries(ORG_KINDS).map(([k, n]) => (
            <TickRow
              key={k}
              single
              on={chipOn(answers, "orgkind", k)}
              name={n}
              onToggle={() => toggleChip("orgkind", k, true, "org")}
            />
          ))}
        </div>
      </section>

      {/* Centred, like the question above it and like the search below it.
          Left against the edge, a heading and its line sat in the first sixth
          of a 1320px card with a centred question over them and a centred
          search under them - three alignments on one screen. */}
      <SubTitle className="justify-center" count={chosen.length || undefined}>
        The field you work in
      </SubTitle>
      <p className="mt-0.5 mx-auto max-w-[62ch] text-center text-[12.5px] leading-[1.45] text-label">
        Not a category for a form. It is what tells us the stock is perishable,
        or the goods are oversized, or that somebody is checking, before anybody
        has to explain it.
      </p>

      {/* A search over fifty-five rows, because thirteen headings still take
          scrolling and somebody who knows their trade should be able to type
          it. */}
      <label className="mt-3 flex mx-auto max-w-[420px] items-center gap-2.5 rounded-field bg-canvas px-3.5 py-2.5">
        <Search aria-hidden className="size-4 flex-none text-idx" />
        <input
          value={find}
          onChange={(event) => setFind(event.target.value)}
          placeholder={`Search ${Object.keys(SECTORS).length} industries`}
          className="min-w-0 flex-1 bg-transparent text-[14px] text-ink outline-none placeholder:text-label"
        />
      </label>

      {/* The families. Pressing one opens it and closes whatever was open:
          two open at once is most of the wall back again. */}
      {hunted ? null : (
        <div className="mt-4 flex mx-auto max-w-[1100px] flex-wrap gap-2">
          {families.map(([name, rows]) => {
            const on = name === family;
            const has = rows.some((row) => isOn(answers, "sector", row.k));

            return (
              <button
                key={name}
                type="button"
                aria-pressed={on}
                onClick={() => setFamily(on ? null : name)}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-pill px-3.5 py-1.5 text-[13px] font-semibold transition-colors",
                  on
                    ? "bg-ink text-white"
                    : "bg-canvas text-body hover:bg-hair hover:text-ink",
                )}
              >
                {name}
                {has ? (
                  <Check
                    aria-hidden
                    className={cn("size-3", on ? "text-white" : "text-mark")}
                    strokeWidth={3}
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-5 grid mx-auto max-w-[1100px] gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map(([family, rows]) => (
          <section key={family} className="min-w-0">
            <Kicker className="block text-ink">{family}</Kicker>
            <div className="mt-2 flex flex-col">
              {rows.map((row) => (
                <TickRow
                  key={row.k}
                  on={isOn(answers, "sector", row.k)}
                  name={row.n}
                  onToggle={() => togglePick("sector", row.k, "org")}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Only when something was actually searched for.

          The test was `shown.length === 0`, which is also true on arrival: no
          family opened and nothing typed means no rows, so the screen opened
          by reporting that a search had failed before anybody had made one. */}
      {hunted && shown.length === 0 ? (
        <p className="mt-4 text-center text-[13.5px] text-quiet">
          Nothing matches that. Leave it and tell us in your own words below.
        </p>
      ) : null}

      {/* What the picks imply, said back rather than kept. */}
      {chosen.length ? (
        <section className="mt-8 mx-auto max-w-[820px] rounded-[16px] bg-canvas p-5">
          <Kicker className="block">What that brings with it</Kicker>
          <ul className="mt-3 flex flex-col gap-3">
            {chosen.map((k) => {
              const tag = SECTOR_TAGS[k];
              if (!tag) return null;

              return (
                <li key={k} className="min-w-0">
                  <b className="text-[14px] font-bold text-ink">{tag.n}</b>
                  <p className="mt-1 flex flex-wrap gap-x-2 gap-y-1">
                    {tag.t.map((type) => (
                      <span
                        key={type}
                        className="rounded-pill bg-field px-2 py-0.5 font-mono text-[9px] font-bold tracking-[0.12em] text-mark uppercase"
                      >
                        {TYPE_NAMES[type] ?? type}
                      </span>
                    ))}
                  </p>
                  {tag.p.length ? (
                    <p className="mt-1.5 text-[12.5px] leading-[1.5] text-quiet">
                      {tag.p.join(" · ")}
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {/* Held to the reading measure and off whatever is above it. Run
          full width against the panel it follows, it read as part of that
          panel rather than as the next thing to do. */}
      <div className="mt-6 mx-auto max-w-[720px]">
        <AddRow
          label="Something else"
          placeholder="Tell us in your own words."
          onAdd={(value) => addOwn("org-own", value, "org")}
        />
      </div>
    </StageStep>
  );
}

/* -------------------------------------------------------------- 08 widgets */

/**
 * Widgets and applications.
 *
 * The one step with no list to tick, and that is stated rather than hidden. The
 * catalogue is being put together with the people who build these; until it is
 * here, what somebody writes is read exactly as though they had ticked it, and
 * saying so is worth more than a list of plausible-sounding names.
 */
export function StageWidgets({ at, answers, onGo }: StepProps) {
  return (
    <StageStep at={at} answers={answers} onGo={onGo}>
      <H>Anything working inside a page?</H>
      <Sub>
        A calculator, a map, a chat window, a feed, a search, a form that does
        something more than send an email. If you already know what you want
        here, name it. If you do not, leave it: none of it changes the shape of
        the site.
      </Sub>

      <section className="mt-6 mx-auto max-w-[720px] rounded-[16px] bg-canvas p-5">
        <Kicker className="block">The list you pick from</Kicker>
        <p className="mt-2 text-[13px] leading-[1.6] text-body">
          Being put together with the people who build these. Until it is here,
          anything you write below is read exactly as though you had ticked it.
        </p>
      </section>

      {/* Held to the reading measure and off whatever is above it. Run
          full width against the panel it follows, it read as part of that
          panel rather than as the next thing to do. */}
      <div className="mt-6 mx-auto max-w-[720px]">
        <AddRow
          label="Tell us what it has to do"
          placeholder="A calculator that works out what a job costs, a map of where you deliver, a search that reads your stock."
          onAdd={(value) => addOwn("widgets-own", value, "widgets")}
        />
      </div>
    </StageStep>
  );
}

/* -------------------------------------------------------------- 09 systems */

/**
 * Connecting to back end systems.
 *
 * Four columns, and the third and fourth are the honest ones: what the market
 * already sells for this record, and what we would therefore do about it. Two
 * rows say we would not build the thing - you can buy a booking diary and a
 * shop platform, and buying one is better than paying us to write another.
 *
 * A ticked row opens one more question, and only one: who holds that record
 * today. It is the whole difference between connecting to something, replacing
 * something, and starting from nothing.
 */
export function StageSystems({ at, answers, onGo }: StepProps) {
  return (
    <StageStep at={at} answers={answers} onGo={onGo}>
      <H>What does it have to talk to?</H>
      <Sub>
        The things already running that the website has to agree with. Ticking
        one is not a promise that it connects - it is what tells us to go and
        find out before anything is quoted.
      </Sub>

      {/* Just the list. The prototype puts a table above this one - eight rows
          arguing what a record has to hold and whether we would build it - and
          that is a conversation to have with somebody, not a question to put to
          them before they have said what they run. */}
      <div className="mt-6 flex mx-auto max-w-[860px] flex-col gap-6">
        {SYSTEM_LINKS.map((group) => (
          <section key={group.title} className="min-w-0">
            <Kicker className="block text-ink">{group.title}</Kicker>

            <div className="mt-2 grid gap-x-8 sm:grid-cols-2">
              {group.rows.map((row) => (
                <TickRow
                  key={row.k}
                  on={chipOn(answers, "syslink", row.k)}
                  name={row.n}
                  note={row.note}
                  onToggle={() =>
                    toggleChip("syslink", row.k, false, "systems")
                  }
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-6 mx-auto max-w-[720px]">
        <AddRow
          label="Something else it has to talk to"
          placeholder="Name it, and what it is called."
          onAdd={(value) => addOwn("systems-own", value, "systems")}
        />
      </div>
    </StageStep>
  );
}
