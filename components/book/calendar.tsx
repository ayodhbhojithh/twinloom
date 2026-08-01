"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  addDays,
  dayKey,
  firstBookable,
  freeCount,
  isBookable,
  lastBookable,
  monthGrid,
  type Reader,
} from "./diary";

/**
 * A month, navigable by keyboard.
 *
 * `role="grid"` with a roving tab stop, which is what a date picker is supposed
 * to be and what almost none of them are. One date is in the tab order at a
 * time; the arrows move within the month, Home and End go to the ends of a week,
 * Page Up and Page Down change month. Reaching for a date should not mean
 * pressing Tab thirty times.
 *
 * Weekday names and the day the week starts on both come from the reader's
 * locale. A calendar that starts on Monday for everyone is a calendar that is
 * wrong in half the world.
 */
export function Calendar({
  reader,
  selected,
  onSelect,
}: {
  reader: Reader;
  selected: string | null;
  onSelect: (key: string) => void;
}) {
  const opening = firstBookable();

  const [view, setView] = useState(() => ({
    year: opening.getFullYear(),
    month: opening.getMonth(),
  }));

  /* The date the keyboard is on, which is not always the date chosen. */
  const [cursor, setCursor] = useState(() => dayKey(opening));
  const moveFocus = useRef(false);
  const grid = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    grid.current
      ?.querySelector<HTMLButtonElement>(`[data-key="${cursor}"]`)
      ?.focus();
  }, [cursor]);

  const weeks = monthGrid(view.year, view.month, reader.weekStart);

  const monthName = new Intl.DateTimeFormat(reader.locale, {
    month: "long",
    year: "numeric",
  }).format(new Date(view.year, view.month, 1));

  const weekdayShort = new Intl.DateTimeFormat(reader.locale, {
    weekday: "short",
  });
  const weekdayLong = new Intl.DateTimeFormat(reader.locale, {
    weekday: "long",
  });
  const dateLong = new Intl.DateTimeFormat(reader.locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const headers = Array.from({ length: 7 }, (_, at) =>
    /* 2024-01-07 was a Sunday, so this walks a whole week from the reader's
       own starting day without hardcoding any names. */
    new Date(2024, 0, 7 + ((reader.weekStart + at) % 7)),
  );

  const openFrom = opening;
  const openTo = lastBookable();

  const canGoBack =
    new Date(view.year, view.month, 1) >
    new Date(openFrom.getFullYear(), openFrom.getMonth(), 1);
  const canGoOn =
    new Date(view.year, view.month, 1) <
    new Date(openTo.getFullYear(), openTo.getMonth(), 1);

  function shift(months: number) {
    setView((was) => {
      const next = new Date(was.year, was.month + months, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  }

  function moveTo(date: Date) {
    setCursor(dayKey(date));
    moveFocus.current = true;
    if (date.getMonth() !== view.month || date.getFullYear() !== view.year) {
      setView({ year: date.getFullYear(), month: date.getMonth() });
    }
  }

  function onKeyDown(event: React.KeyboardEvent) {
    const [year, month, day] = cursor.split("-").map(Number);
    const at = new Date(year, month - 1, day);

    const steps: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
    };

    if (steps[event.key] !== undefined) {
      event.preventDefault();
      moveTo(addDays(at, steps[event.key]));
      return;
    }

    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      const into = (at.getDay() - reader.weekStart + 7) % 7;
      moveTo(addDays(at, event.key === "Home" ? -into : 6 - into));
      return;
    }

    if (event.key === "PageUp" || event.key === "PageDown") {
      event.preventDefault();
      const next = new Date(at);
      next.setMonth(next.getMonth() + (event.key === "PageUp" ? -1 : 1));
      moveTo(next);
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3
          id="calendar-heading"
          aria-live="polite"
          className="text-[16px] font-bold tracking-[-0.015em] text-ink"
        >
          {monthName}
        </h3>

        <div className="flex items-center gap-1">
          <Step
            label="Previous month"
            disabled={!canGoBack}
            onClick={() => shift(-1)}
          >
            <ChevronLeft className="size-4" />
          </Step>
          <Step
            label="Next month"
            disabled={!canGoOn}
            onClick={() => shift(1)}
          >
            <ChevronRight className="size-4" />
          </Step>
        </div>
      </div>

      <div
        ref={grid}
        role="grid"
        aria-labelledby="calendar-heading"
        onKeyDown={onKeyDown}
      >
        <div role="row" className="grid grid-cols-7">
          {headers.map((date) => (
            <div
              key={date.getDay()}
              role="columnheader"
              aria-label={weekdayLong.format(date)}
              className="pb-2 text-center font-mono text-[9.5px] font-bold tracking-[0.1em] text-label uppercase"
            >
              {weekdayShort.format(date)}
            </div>
          ))}
        </div>

        {weeks.map((week) => (
          <div role="row" key={dayKey(week[0])} className="grid grid-cols-7">
            {week.map((date) => {
              const key = dayKey(date);
              const outside = date.getMonth() !== view.month;
              const open = isBookable(date);
              const chosen = key === selected;
              const free = freeCount(date);

              return (
                <div role="gridcell" key={key} className="p-0.5">
                  <button
                    type="button"
                    data-key={key}
                    disabled={!open}
                    tabIndex={key === cursor ? 0 : -1}
                    aria-selected={chosen}
                    aria-label={`${dateLong.format(date)}${
                      open
                        ? `, ${free} ${free === 1 ? "time" : "times"} free`
                        : ", unavailable"
                    }`}
                    onClick={() => {
                      onSelect(key);
                      setCursor(key);
                    }}
                    onFocus={() => setCursor(key)}
                    className={cn(
                      "relative flex aspect-square w-full flex-col items-center justify-center rounded-field text-[14.5px] font-semibold tabular-nums transition-colors",
                      !open && "cursor-not-allowed text-planned",
                      open && !chosen && "cursor-pointer text-ink hover:bg-hair",
                      chosen && "cursor-pointer bg-ink text-white",
                      outside && open && !chosen && "text-quiet",
                      outside && !open && "text-hair",
                    )}
                  >
                    {date.getDate()}

                    {/* One dot for a day with room, so availability reads at a
                        glance rather than only after a click. */}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute bottom-[7px] size-[3px] rounded-pill transition-colors",
                        open && !chosen && "bg-active",
                        chosen && "bg-white/70",
                        !open && "bg-transparent",
                      )}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function Step({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex size-8 cursor-pointer items-center justify-center rounded-field border border-border text-quiet transition-colors hover:border-ink hover:text-ink disabled:cursor-not-allowed disabled:border-hair disabled:text-planned"
    >
      {children}
    </button>
  );
}
