"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  Check,
  FileText,
  Layers,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { ActionButton, Container, Reveal, Rise } from "@/components/shared";
import { useThoughtsSession } from "@/components/thoughts";
import { CARE_TEASER } from "@/lib/content/home";
import { SITE } from "@/lib/content/site";
import {
  ASSETS,
  estimate,
  formatPrice,
  getServerSnapshot,
  getSnapshot,
  PRICING_NOTE,
  readiness,
  subscribe,
} from "@/lib/scoping";
import { pluralise } from "@/lib/format";

/** One block of the Blueprint. Same label treatment as the panel and the journey. */
function Block({
  label,
  icon,
  meta,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  meta?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-card bg-panel-bg p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <span aria-hidden className="shrink-0 text-brand">
          {icon}
        </span>
        <h2 className="font-mono text-[9.5px] font-bold tracking-[0.14em] text-faint uppercase">
          {label}
        </h2>
        {meta ? <span className="ml-auto shrink-0">{meta}</span> : null}
      </div>

      <div className="mt-3">{children}</div>
    </section>
  );
}

/**
 * The Blueprint: the resolved, priced output of the journey (TCT_Scope_Spec.md §3).
 *
 * Everything here is derived. Nothing on this page was typed by anyone: the tier,
 * the band, the page list, the timeline and the care recommendation all come out of
 * `estimate()` reading the answers, which is what makes it reproducible and what
 * will let the same figures be generated server side for the written plan.
 *
 * It reads the answers from the session store rather than from props, because the
 * journey is a different route and this page has to survive being opened directly.
 * Arriving with nothing answered is a real state, so it has a real empty screen
 * rather than a page of zeroes.
 */
export function BlueprintView() {
  const answers = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const { count: captured } = useThoughtsSession();

  const result = useMemo(() => estimate(answers, ASSETS.length), [answers]);
  const gaps = useMemo(() => readiness(answers, ASSETS.length), [answers]);

  if (!result.components.length) {
    return (
      <Container width="page" className="py-16 text-center sm:py-24">
        <Rise>
          <p className="font-mono text-[10.5px] font-bold tracking-[0.14em] text-faint uppercase">
            Blueprint
          </p>

          <h1 className="mt-3 text-[26px] font-extrabold tracking-[-0.02em] sm:text-[32px]">
            Nothing to build from yet.
          </h1>

          <p className="mx-auto mt-3 max-w-[440px] text-[15px] leading-[1.65] text-body">
            The Blueprint is worked out from your answers, so it needs a few of
            them first. The journey takes about three minutes.
          </p>

          <div className="mt-7 flex justify-center">
            <ActionButton href="/scope">
              Start the journey
              <ArrowRight aria-hidden className="size-4" />
            </ActionButton>
          </div>
        </Rise>
      </Container>
    );
  }

  const [fromWeeks, toWeeks] = result.weeks;
  const carePlan = CARE_TEASER.plans.find((plan) => plan.name === result.care);

  return (
    <Container className="pt-4 pb-6">
      <div className="flex items-baseline justify-between gap-4">
        <p className="font-mono text-[10.5px] font-bold tracking-[0.14em] text-faint uppercase">
          Your blueprint
        </p>

        <a
          href="/scope"
          className="flex items-center gap-1.5 font-mono text-[10.5px] font-bold tracking-[0.1em] text-faint uppercase transition-colors hover:text-ink"
        >
          <ArrowLeft aria-hidden className="size-3" />
          Change my answers
        </a>
      </div>

      {/* Block 1. The package match, and why this one. */}
      <Rise className="mt-3">
        <div className="rounded-[22px] bg-panel-bg p-5 sm:p-7">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,300px)] lg:gap-8">
            <div>
              <p className="font-mono text-[9.5px] font-bold tracking-[0.14em] text-brand uppercase">
                Package match
              </p>

              <h1 className="mt-2 text-[27px] font-extrabold tracking-[-0.02em] sm:text-[33px]">
                {result.tier}
              </h1>

              <p className="mt-2 max-w-[520px] text-[14.5px] leading-[1.6] text-body">
                {result.why}
              </p>

              <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-4">
                <div>
                  <dt className="font-mono text-[9.5px] font-bold tracking-[0.12em] text-faint uppercase">
                    Build
                  </dt>
                  <dd className="mt-1 text-[21px] leading-none font-extrabold tracking-[-0.02em] tabular-nums">
                    {formatPrice(result.low, result.high)}
                  </dd>
                </div>

                <div>
                  <dt className="font-mono text-[9.5px] font-bold tracking-[0.12em] text-faint uppercase">
                    Timeline
                  </dt>
                  <dd className="mt-1 text-[21px] leading-none font-extrabold tracking-[-0.02em] tabular-nums">
                    {fromWeeks} to {toWeeks} weeks
                  </dd>
                </div>

                <div>
                  <dt className="font-mono text-[9.5px] font-bold tracking-[0.12em] text-faint uppercase">
                    Care
                  </dt>
                  <dd className="mt-1 text-[21px] leading-none font-extrabold tracking-[-0.02em] tabular-nums">
                    £{carePlan?.price ?? CARE_TEASER.plans[0].price}
                    <span className="ml-1 text-[13px] font-semibold text-faint">
                      / month
                    </span>
                  </dd>
                </div>
              </dl>

              <p className="mt-4 font-mono text-[10px] leading-[1.55] tracking-[0.03em] text-faint">
                {PRICING_NOTE}
              </p>
            </div>

            {/* Block 2. Readiness, as a bar rather than a gauge: it is one number
                out of one hundred and a gauge would only dress it up. */}
            <div className="rounded-card bg-bg p-4 shadow-card lg:self-start">
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-mono text-[9.5px] font-bold tracking-[0.14em] text-faint uppercase">
                  Readiness
                </p>
                <p className="text-[19px] leading-none font-extrabold tabular-nums">
                  {gaps.score}
                  <span className="text-[12px] font-semibold text-faint">
                    /100
                  </span>
                </p>
              </div>

              <div
                aria-hidden
                className="mt-3 h-1.5 overflow-hidden rounded-pill bg-panel-bg"
              >
                <div
                  className="h-full rounded-pill bg-brand transition-[width] duration-700 ease-[var(--ease-out-soft)]"
                  style={{ width: `${gaps.score}%` }}
                />
              </div>

              <ul className="mt-3 flex flex-col gap-1.5">
                <li className="flex items-baseline justify-between gap-3 text-[12.5px]">
                  <span className="text-body">You already have</span>
                  <span className="font-mono font-bold tabular-nums">
                    {gaps.have}
                  </span>
                </li>
                <li className="flex items-baseline justify-between gap-3 text-[12.5px]">
                  <span className="text-body">We will provide</span>
                  <span className="font-mono font-bold tabular-nums">
                    {gaps.missing}
                  </span>
                </li>
                <li className="flex items-baseline justify-between gap-3 text-[12.5px]">
                  <span className="text-body">To check together</span>
                  <span className="font-mono font-bold tabular-nums">
                    {gaps.unsure + gaps.outstanding}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Rise>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {/* Block 3. The derived sitemap. */}
        <Reveal>
          <Block
            label="Derived sitemap"
            icon={<FileText className="size-3.5" />}
            meta={
              <span className="font-mono text-[9.5px] font-bold text-faint tabular-nums">
                {pluralise(result.sitemap.length, "page")}
              </span>
            }
          >
            <p className="text-[12.5px] leading-[1.55] text-body">
              We worked this out from what the site has to do. Confirm it or tell
              us what is missing.
            </p>

            <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
              {result.sitemap.map((page, at) => (
                <li
                  key={page}
                  className="flex items-center gap-2 rounded-btn-sm bg-bg px-2.5 py-2 shadow-card"
                >
                  <span className="font-mono text-[9px] font-bold text-faint tabular-nums">
                    {String(at + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[12.5px] font-semibold">
                    {page}
                  </span>
                </li>
              ))}
            </ul>
          </Block>
        </Reveal>

        {/* Block 4. Component scope, by section, with its share of the points. */}
        <Reveal index={1}>
          <Block
            label="Component scope"
            icon={<Layers className="size-3.5" />}
            meta={
              <span className="font-mono text-[9.5px] font-bold text-faint tabular-nums">
                {pluralise(result.components.length, "item")}
              </span>
            }
          >
            <ul className="flex flex-col">
              {result.bySection.map((section) => {
                const share = result.points
                  ? (section.points / result.points) * 100
                  : 0;

                return (
                  <li
                    key={section.step}
                    className="py-2 not-last:border-b not-last:border-line/70"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="min-w-0 flex-1 truncate text-[12.5px] font-bold">
                        {section.step}
                      </span>
                      <span className="font-mono text-[10px] text-faint tabular-nums">
                        {section.count} · {section.points} pts
                      </span>
                    </div>

                    <div
                      aria-hidden
                      className="mt-1.5 h-1 overflow-hidden rounded-pill bg-bg"
                    >
                      <div
                        className="h-full rounded-pill bg-brand/55"
                        style={{ width: `${share}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>

            <p className="mt-3 font-mono text-[10px] leading-[1.5] text-faint">
              {result.points} build points · points set the tier and the band
            </p>
          </Block>
        </Reveal>

        {/* Block 8. The timeline, as the milestones of the home page's ledger. */}
        <Reveal index={2}>
          <Block label="Timeline" icon={<CalendarClock className="size-3.5" />}>
            <ol className="flex flex-col">
              {[
                { name: "Discover", detail: "A call, then a plan we both sign off" },
                { name: "Design", detail: "Every screen approved before we build" },
                { name: "Build", detail: "In milestones, preview link from week one" },
                { name: "Launch", detail: "Tested, handed over, walked through" },
              ].map((phase, at) => (
                <li
                  key={phase.name}
                  className="flex items-center gap-3 py-2 not-last:border-b not-last:border-line/70"
                >
                  <span
                    aria-hidden
                    className="flex size-6 shrink-0 items-center justify-center rounded-full bg-bg font-mono text-[9.5px] font-bold text-brand shadow-card tabular-nums"
                  >
                    {String(at + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12.5px] leading-tight font-bold">
                      {phase.name}
                    </span>
                    <span className="mt-0.5 block text-[11.5px] leading-tight text-faint">
                      {phase.detail}
                    </span>
                  </span>
                </li>
              ))}
            </ol>

            <p className="mt-3 font-mono text-[10px] text-faint tabular-nums">
              {fromWeeks} to {toWeeks} weeks end to end
            </p>
          </Block>
        </Reveal>

        {/* Block 9. Care, and what the panel picked up along the way. */}
        <Reveal index={3}>
          <Block
            label="Care recommendation"
            icon={<ShieldCheck className="size-3.5" />}
          >
            <p className="text-[15px] font-extrabold">{result.care}</p>
            <p className="mt-1 text-[12.5px] leading-[1.55] text-body">
              {carePlan?.body}
            </p>

            {carePlan ? (
              <ul className="mt-3 flex flex-col gap-1.5">
                {carePlan.points.map((point) => (
                  <li
                    key={point.label}
                    className="flex items-start gap-2 text-[12.5px] leading-[1.5] text-body"
                  >
                    <Check
                      aria-hidden
                      className="mt-0.5 size-3.5 shrink-0 text-brand"
                      strokeWidth={3}
                    />
                    {point.label}
                  </li>
                ))}
              </ul>
            ) : null}

            <p className="mt-3 flex items-center gap-1.5 border-t border-line pt-3 font-mono text-[10px] tracking-[0.06em] text-faint uppercase">
              <Sparkles aria-hidden className="size-3 text-accent-amber" />
              Captured
              <span className="font-medium normal-case">
                {captured === 0
                  ? "nothing from your panel yet"
                  : `${pluralise(captured, "item")} from your panel`}
              </span>
            </p>
          </Block>
        </Reveal>
      </div>

      {/* Block 9, the CTA. The written plan is the next artefact, so this hands
          over by email rather than promising a page that is not built. */}
      <Reveal delay={0.1} className="mt-4">
        <div className="rounded-card bg-panel-bg p-5 text-center sm:p-7">
          <h2 className="text-[19px] font-extrabold tracking-[-0.02em] sm:text-[23px]">
            Happy with this? Let&rsquo;s make it a plan.
          </h2>

          <p className="mx-auto mt-2 max-w-[520px] text-[14px] leading-[1.6] text-body">
            Send it over and we will come back with your written website plan: the
            same figures, in full, with what we would do and in what order.
          </p>

          <div className="mt-5 flex flex-col items-stretch justify-center gap-2.5 sm:flex-row sm:items-center">
            <ActionButton
              href={`mailto:${SITE.email}?subject=My%20blueprint%20(${encodeURIComponent(result.tier)})`}
            >
              Send my blueprint
              <ArrowRight aria-hidden className="size-4" />
            </ActionButton>

            <ActionButton variant="secondary" href="/scope">
              Change my answers
            </ActionButton>
          </div>
        </div>
      </Reveal>
    </Container>
  );
}
