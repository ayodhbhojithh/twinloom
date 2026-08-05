"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import {
  ORG_KINDS,
  SECTORS,
  SECTOR_TAGS,
  SYS_LINKS,
  SYS_WHO,
  TYPE_NAMES,
} from "@/lib/build/v5";
import { SYSTEM_ROWS } from "@/lib/build/v5-systems";
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
import { AddRow, H, Kicker, Sub, SubTitle, TickRow, TickSet } from "./kit";

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
  const families = useMemo(() => sectorFamilies(), []);
  const chosen = picked(answers, "sector");

  const hunted = find.trim().toLowerCase();
  const shown = hunted
    ? families
        .map(([family, rows]) => [
          family,
          rows.filter(
            (row) =>
              row.n.toLowerCase().includes(hunted) ||
              family.toLowerCase().includes(hunted),
          ),
        ] as const)
        .filter(([, rows]) => rows.length)
    : families;

  return (
    <StageStep at={at} answers={answers} onGo={onGo}>
      <H>What kind of organisation is this?</H>
      <Sub>
        Everything else on the build follows this one. One site with one
        identity, one site with a section each, and separate sites are three
        different builds, and the argument about who updates what arrives either
        way.
      </Sub>

      <section className="mt-6 max-w-[1100px]">
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

      <SubTitle count={chosen.length || undefined}>The field you work in</SubTitle>
      <p className="mt-0.5 max-w-[62ch] text-[12.5px] leading-[1.45] text-label">
        Not a category for a form. It is what tells us the stock is perishable,
        or the goods are oversized, or that somebody is checking, before anybody
        has to explain it.
      </p>

      {/* A search over fifty-five rows, because thirteen headings still take
          scrolling and somebody who knows their trade should be able to type
          it. */}
      <label className="mt-3 flex max-w-[420px] items-center gap-2.5 rounded-field bg-canvas px-3.5 py-2.5">
        <Search aria-hidden className="size-4 flex-none text-idx" />
        <input
          value={find}
          onChange={(event) => setFind(event.target.value)}
          placeholder={`Search ${Object.keys(SECTORS).length} industries`}
          className="min-w-0 flex-1 bg-transparent text-[14px] text-ink outline-none placeholder:text-label"
        />
      </label>

      <div className="mt-5 grid max-w-[1100px] gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
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

      {shown.length === 0 ? (
        <p className="mt-4 text-[13.5px] text-quiet">
          Nothing matches that. Leave it and tell us in your own words below.
        </p>
      ) : null}

      {/* What the picks imply, said back rather than kept. */}
      {chosen.length ? (
        <section className="mt-8 max-w-[820px] rounded-[16px] bg-canvas p-5">
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

      <AddRow
        label="Something else"
        placeholder="Tell us in your own words."
        onAdd={(value) => addOwn("org-own", value, "org")}
      />
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

      <section className="mt-6 max-w-[720px] rounded-[16px] bg-canvas p-5">
        <Kicker className="block">The list you pick from</Kicker>
        <p className="mt-2 text-[13px] leading-[1.6] text-body">
          Being put together with the people who build these. Until it is here,
          anything you write below is read exactly as though you had ticked it.
        </p>
      </section>

      <AddRow
        label="Tell us what it has to do"
        placeholder="A calculator that works out what a job costs, a map of where you deliver, a search that reads your stock."
        onAdd={(value) => addOwn("widgets-own", value, "widgets")}
      />
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
        One row for each kind of thing you sell. Tick the ones that are true. A
        ticked row asks one more question underneath it, and nothing here is
        priced.
      </Sub>

      <div className="mt-6 flex max-w-[1100px] flex-col gap-3">
        {SYSTEM_ROWS.map((row) => {
          const on = isOn(answers, "systype", row.k);

          return (
            <section
              key={row.k}
              className={cn(
                "rounded-[16px] p-5 transition-colors",
                on ? "bg-canvas" : "bg-field",
              )}
            >
              <TickRow
                on={on}
                name={TYPE_NAMES[row.ty] ?? row.ty}
                note={row.rec}
                onToggle={() => togglePick("systype", row.k, "systems")}
              />

              {/* What the market sells for it, and what we would do. Side by
                  side, because the second only means anything against the
                  first. */}
              <div className="mt-3 grid gap-x-8 gap-y-3 pl-8 sm:grid-cols-2">
                <div className="min-w-0">
                  <Kicker className="block">What people generally use</Kicker>
                  <p className="mt-1 text-[12.5px] leading-[1.5] text-quiet">
                    {row.market}
                  </p>
                </div>
                <div className="min-w-0">
                  <Kicker className="block text-ink">What we would do</Kicker>
                  <p className="mt-1 text-[12.5px] leading-[1.5] text-body">
                    {row.ours}
                  </p>
                </div>
              </div>

              {on ? (
                <div className="mt-4 border-t border-hair pt-4 pl-8">
                  <b className="block text-[13.5px] font-bold text-ink">
                    Who holds that record today?
                  </b>
                  <p className="mt-0.5 text-[12.5px] leading-[1.45] text-label">
                    One answer. It decides whether we connect to something,
                    replace something, or start from nothing.
                  </p>
                  <TickSet
                    single
                    className="mt-2.5"
                    options={Object.entries(SYS_WHO).map(([k, n]) => ({ k, label: n }))}
                    isOn={(k: string) => chipOn(answers, `syswho.${row.k}`, k)}
                    onPick={(k: string) => toggleChip(`syswho.${row.k}`, k, true, "systems")}
                  />
                </div>
              ) : null}
            </section>
          );
        })}
      </div>

      <SubTitle>What it has to join to</SubTitle>
      <p className="mt-0.5 max-w-[62ch] text-[12.5px] leading-[1.45] text-label">
        The things already running that the website has to agree with. Ticking
        one is not a promise that it connects - it is what tells us to go and
        find out before anything is quoted.
      </p>

      <div className="mt-3 grid max-w-[1100px] gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(SYS_LINKS).map(([k, n]) => (
          <TickRow
            key={k}
            on={chipOn(answers, "syslink", k)}
            name={n}
            onToggle={() => toggleChip("syslink", k, false, "systems")}
          />
        ))}
      </div>

      <AddRow
        label="Something else it has to talk to"
        placeholder="Name it, and what it is called."
        onAdd={(value) => addOwn("systems-own", value, "systems")}
      />
    </StageStep>
  );
}
