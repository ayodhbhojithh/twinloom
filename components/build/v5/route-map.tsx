"use client";

import { PHASES, STEPS } from "@/lib/build/v5";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   The run-through as a route map.

   One line, twelve stops, three zones. A map rather than a bar being filled:
   ten of the twelve can be walked past, so what matters is seeing the whole
   line before setting off, not being told how far along it you are.

   The stops carry numbers and nothing else. The spine beside this names all
   twelve in full and the phase bar it replaces named none of them, so printing
   them here would be a second copy of the list rather than a picture of it.

   Three marks, each meaning one thing. A filled stop is a step. A ring is an
   interchange, which is where one zone becomes the next. The stop you are on is
   green, carries its number inside it, and is tagged in words.
--------------------------------------------------------------------------- */

export function RouteMap({
  step,
  onGo,
}: {
  step: number;
  onGo: (at: number) => void;
}) {
  const order = PHASES.map(([key]) => key);

  /* Where each zone starts, so an interchange is worked out from the data
     rather than from two numbers typed in by hand. */
  const zoneStart = order.map((key) =>
    STEPS.findIndex((entry) => entry.ph === key),
  );

  return (
    <section aria-label="Where this has got to" className="mb-7">
      {/* Dragged sideways rather than squeezed. Twelve named stops is a map you
          move across, which is what a map is for; wrapping it onto three lines
          would stop it being one line, and one line is the whole claim. */}
      <div className="quiet-scroll -mx-1 overflow-x-auto px-1 pb-1">
        <div className="min-w-[540px]">
          {/* The zones, each as wide as the number of stops it holds, with a
              rule over it in the manner of a map's own key. */}
          <div
            className="grid gap-x-6"
            style={{
              gridTemplateColumns: order
                .map((key) => `${STEPS.filter((e) => e.ph === key).length}fr`)
                .join(" "),
            }}
          >
            {PHASES.map(([key, name, note], n) => {
              const on = n === order.indexOf(STEPS[step].ph);

              return (
                <div
                  key={key}
                  className={cn(
                    "min-w-0 border-t pt-2.5 transition-colors",
                    on ? "border-ink" : "border-border",
                  )}
                >
                  {/* No "Zone 1" over it. The numbers are already on the line
                      underneath, and a label counting the same three things a
                      second time is a label doing nothing. */}
                  <b
                    className={cn(
                      "block text-[13.5px] leading-[1.2] font-bold tracking-[-0.01em]",
                      on ? "text-ink" : "text-quiet",
                    )}
                  >
                    {name}
                  </b>
                  <span className="mt-1 block text-[11.5px] leading-[1.4] text-label">
                    {note}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="relative mt-4 px-1 py-3">
            {/* The zone divisions carried down through the map, so a stop can
                be read back to the zone it belongs to without counting. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-1 left-1 grid gap-x-6"
              style={{
                gridTemplateColumns: order
                  .map((key) => `${STEPS.filter((e) => e.ph === key).length}fr`)
                  .join(" "),
              }}
            >
              {order.map((key, n) => (
                <span
                  key={key}
                  className={cn(n > 0 && "border-l border-border")}
                />
              ))}
            </div>

            <ol
              className="relative grid"
              style={{ gridTemplateColumns: `repeat(${STEPS.length}, 1fr)` }}
            >
              {STEPS.map((entry, n) => {
                const here = n === step;
                const change = zoneStart.includes(n) && n > 0;
                const index = String(n + 1).padStart(2, "0");

                return (
                  <li key={entry.k} className="flex min-w-0 justify-center">
                    {/* The line is drawn per stop rather than as one bar behind
                        them, so it can change colour where the run has reached
                        without any absolute positioning to keep in step. */}
                    <span className="relative flex h-[22px] w-full items-center justify-center">
                      <span
                        aria-hidden
                        className={cn(
                          "absolute top-1/2 left-0 h-[2px] w-1/2 -translate-y-1/2",
                          n === 0 ? "hidden" : n <= step ? "bg-ink" : "bg-planned",
                        )}
                      />
                      <span
                        aria-hidden
                        className={cn(
                          "absolute top-1/2 right-0 h-[2px] w-1/2 -translate-y-1/2",
                          n === STEPS.length - 1
                            ? "hidden"
                            : n < step
                              ? "bg-ink"
                              : "bg-planned",
                        )}
                      />

                      <button
                        type="button"
                        onClick={() => onGo(n)}
                        title={entry.n}
                        aria-label={`${entry.n}, stop ${n + 1} of ${STEPS.length}`}
                        aria-current={here ? "step" : undefined}
                        className="relative z-10 cursor-pointer"
                      >
                        <span
                          aria-hidden
                          className={cn(
                            "flex items-center justify-center rounded-pill border-2 font-mono text-[9px] font-bold text-white transition-all",
                            here
                              ? "size-[20px] border-done bg-done"
                              : change
                                ? "size-[13px] border-ink bg-field"
                                : n < step
                                  ? "size-[11px] border-ink bg-ink"
                                  : "size-[11px] border-planned bg-planned",
                          )}
                        >
                          {here ? index : null}
                        </span>
                      </button>
                    </span>
                  </li>
                );
              })}
            </ol>

            {/* The numbers on their own row under the line, which is what keeps
                them an unbroken run rather than twelve labels each fighting for
                the space beside a dot. */}
            <ol
              aria-hidden
              className="relative mt-1.5 grid"
              style={{ gridTemplateColumns: `repeat(${STEPS.length}, 1fr)` }}
            >
              {STEPS.map((entry, n) => (
                <li
                  key={entry.k}
                  className={cn(
                    "text-center font-mono text-[9px] font-bold tabular-nums",
                    n === step ? "text-ink" : "text-idx",
                  )}
                >
                  {String(n + 1).padStart(2, "0")}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
