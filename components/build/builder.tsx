"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";

import { BANDS, GROUPS } from "@/lib/build/data";
import {
  actionBands,
  derivedPages,
  offeredActions,
  pageCount,
  pruneActions,
} from "@/lib/build/derive";
import {
  getServerSnapshot,
  getSnapshot,
  subscribe,
  updateAnswers,
} from "@/lib/build/store";
import { ROUTES } from "@/lib/site";

import { ActionTable } from "./action-table";
import { Area } from "./area";
import { PickCard } from "./pick-card";
import { SiteMap } from "./site-map";

/**
 * The two questions: who comes to your website, and what each of them should be
 * able to do.
 *
 * The second question is written by the first. Naming a group makes its actions
 * appear in a band of their own; taking a group away takes its actions with it,
 * so the site described back can only hold what was actually asked for. That
 * rule lives in `pruneActions`, not here, because the site screen has to trust
 * it too.
 *
 * The panel down the right is the answer being written while the questions are
 * answered. It is what makes this a tool rather than a form: nothing is
 * submitted, and the result is already on screen.
 *
 * Answers go to the session store rather than component state, because the site
 * screen is a different route and it reads the same selection.
 */
export function Builder() {
  const answers = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const [open, setOpen] = useState({ who: true, can: true });
  const [draft, setDraft] = useState("");

  const bands = useMemo(() => actionBands(answers.groups), [answers.groups]);
  const zones = useMemo(() => derivedPages(answers), [answers]);
  const pages = useMemo(() => pageCount(answers), [answers]);

  const offered = offeredActions(answers.groups).length + answers.own.length;
  const picked = answers.actions.length + answers.own.length;

  function toggleGroup(key: string) {
    updateAnswers((current) => {
      const groups = current.groups.includes(key)
        ? current.groups.filter((entry) => entry !== key)
        : [...current.groups, key];

      /* Pruning here rather than on read: an action nobody can do should stop
         being picked the moment its visitor is removed, not be quietly filtered
         out of every screen that shows it. */
      return {
        ...current,
        groups,
        actions: pruneActions(groups, current.actions),
      };
    });
  }

  function toggleAction(key: string) {
    updateAnswers((current) => ({
      ...current,
      actions: current.actions.includes(key)
        ? current.actions.filter((entry) => entry !== key)
        : [...current.actions, key],
    }));
  }

  function addOwn() {
    const name = draft.replace(/\s+/g, " ").trim().slice(0, 70);
    if (!name) return;

    updateAnswers((current) => ({
      ...current,
      own: [
        ...current.own,
        { key: `own-${current.own.length + 1}-${name.length}`, name },
      ],
    }));
    setDraft("");
  }

  function dropOwn(key: string) {
    updateAnswers((current) => ({
      ...current,
      own: current.own.filter((entry) => entry.key !== key),
    }));
  }

  return (
    <div className="mt-[22px] grid max-w-wide grid-cols-1 border-t border-hair lg:grid-cols-[minmax(0,1fr)_330px] 2xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="min-w-0 lg:border-r lg:border-hair lg:pr-7">
        <Area
          open={open.who}
          onToggle={() => setOpen((was) => ({ ...was, who: !was.who }))}
          title="Your visitors"
          sub="Who comes to your website"
          caption="Layer 1 · tick everyone who might arrive"
          got={answers.groups.length}
          total={GROUPS.length}
          bar="segments"
        >
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 [&>*:last-child]:sm:col-span-2 [&>*:last-child]:xl:col-span-3">
            {GROUPS.map((group, at) => (
              <PickCard
                key={group.key}
                on={answers.groups.includes(group.key)}
                icon={group.icon}
                name={group.name}
                sub={group.sub}
                short={group.short}
                wide={at === GROUPS.length - 1}
                onToggle={() => toggleGroup(group.key)}
              />
            ))}
          </div>
        </Area>

        <Area
          open={open.can}
          onToggle={() => setOpen((was) => ({ ...was, can: !was.can }))}
          title="What your visitors can do"
          sub="One clear thing for each kind of visitor"
          caption="Layer 2 · built from who you named"
          got={picked}
          total={offered}
          bar="proportion"
        >
          <ActionTable
            bands={bands}
            picked={answers.actions}
            own={answers.own}
            ownBand={BANDS.own}
            onToggle={toggleAction}
            onRemoveOwn={dropOwn}
          />

          <form
            className="mt-[25px] border-t border-hair pt-[17px]"
            onSubmit={(event) => {
              event.preventDefault();
              addOwn();
            }}
          >
            <label
              htmlFor="own-action"
              className="mb-[9px] block text-[14px] text-body"
            >
              Missing something? Add whatever else a visitor should be able to
              do, and it joins the list.
            </label>

            <div className="flex items-stretch gap-2.5">
              <input
                id="own-action"
                value={draft}
                maxLength={70}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Anything we have not listed"
                /* A filled box needs no outline to read as a box, and focus is
                   the fill going one step darker rather than a coloured rule. */
                className="min-w-0 flex-1 rounded-field bg-well px-[13px] py-[11px] text-[14.5px] text-ink outline-none transition-colors placeholder:text-label focus:bg-hair"
              />
              <button
                type="submit"
                disabled={!draft.trim()}
                className="flex-none cursor-pointer rounded-field bg-ink px-5 font-mono text-[10px] font-bold tracking-[0.14em] text-white uppercase transition-opacity hover:opacity-85 disabled:cursor-default disabled:bg-well disabled:text-label"
              >
                Add
              </button>
            </div>
          </form>
        </Area>
      </div>

      {/* Sticky at the wide sizes and simply below at the narrow ones. A panel
          that follows you down a page it is taller than would be a panel you
          could not read the bottom of.

          The 20px top sets the panel's first line on the same baseline as the
          first area's title across the rule. Matching the paddings instead would
          not have done it: 10.5px mono and 16px bold sit differently in their
          line boxes, so equal tops read as a step. */}
      <aside className="min-w-0 self-start border-t border-hair pt-[22px] lg:sticky lg:top-[calc(var(--nav-height)+22px)] lg:border-t-0 lg:pt-5 lg:pl-7">
        <p className="mb-2.5 font-mono text-[10.5px] font-bold tracking-[0.14em] text-label uppercase">
          The site your answers describe
        </p>

        <p className="mb-[15px] flex items-baseline gap-2.5">
          <b className="font-mono text-[29px] leading-none font-bold text-ink tabular-nums">
            {pages}
          </b>
          <span className="text-[13.5px] text-quiet">pages, as it stands</span>
        </p>

        <SiteMap zones={zones} compact />

        <p className="mt-[15px] font-mono text-[10.5px] font-semibold tracking-[0.08em] text-label uppercase">
          {answers.groups.length}{" "}
          {answers.groups.length === 1 ? "group named" : "groups named"} ·{" "}
          {picked} {picked === 1 ? "thing to do" : "things to do"}
        </p>

        <p className="mt-[13px] text-[13px] leading-[1.5] text-quiet">
          Built from these two answers alone. Nothing here is a quote, and
          nothing is fixed until you have read the scope and agreed it.
        </p>

        <Link
          href={ROUTES.site}
          className="mt-[18px] inline-block rounded-field bg-ink px-4 py-2.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-85"
        >
          See the full site description
        </Link>
      </aside>
    </div>
  );
}
