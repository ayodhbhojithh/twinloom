"use client";

import { useMemo, useSyncExternalStore } from "react";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";

import {
  ActionButton,
  Container,
  CountUp,
  GrowBar,
  Reveal,
  Rise,
} from "@/components/shared";
import { useThoughtsSession } from "@/components/thoughts";
import { CARE_TEASER } from "@/lib/content/home";
import { SITE } from "@/lib/content/site";
import { pluralise } from "@/lib/format";
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

import { PageGlyph } from "./page-glyph";

/** A mono label, and nothing else. It is the only marker a block gets. */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-mono text-[9.5px] font-bold tracking-[0.14em] text-faint uppercase">
      {children}
    </h2>
  );
}

/**
 * One block. No fill, no outline, no shadow: a label, then the content, with space
 * around it doing the work a card used to.
 */
function Block({
  label,
  meta,
  children,
}: {
  label: string;
  meta?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-baseline justify-between gap-3">
        <Label>{label}</Label>
        {meta ? (
          <span className="shrink-0 font-mono text-[9.5px] text-faint tabular-nums">
            {meta}
          </span>
        ) : null}
      </div>

      <div className="mt-3">{children}</div>
    </section>
  );
}

/** One figure from the estimate: label above, number below, nothing around it. */
function Figure({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string;
  suffix?: string;
}) {
  return (
    <div>
      <dt className="font-mono text-[9.5px] font-bold tracking-[0.12em] text-faint uppercase">
        {label}
      </dt>
      <dd className="mt-2 text-[24px] leading-none font-extrabold tracking-[-0.025em] tabular-nums sm:text-[27px]">
        {value}
        {suffix ? (
          <span className="ml-1 text-[13px] font-semibold text-faint">
            {suffix}
          </span>
        ) : null}
      </dd>
    </div>
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
 * The page is a quiet one on purpose. Somebody has just answered eight sections of
 * questions and is about to read a price, so there is one soft slab at the top to
 * land on and then nothing but type and space: no cards, no rules, no shadows. The
 * numbers are the only thing with any weight, which is exactly where the attention
 * should go.
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
          <Label>Blueprint</Label>

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

  const PHASES = [
    { name: "Discover", detail: "A call, then a plan we both sign off" },
    { name: "Design", detail: "Every screen approved before we build" },
    { name: "Build", detail: "In milestones, preview link from week one" },
    { name: "Launch", detail: "Tested, handed over, walked through" },
  ];

  return (
    <Container className="pt-4 pb-8">
      <div className="flex items-baseline justify-between gap-4">
        <Label>Your blueprint</Label>

        <a
          href="/scope"
          className="flex items-center gap-1.5 font-mono text-[9.5px] font-bold tracking-[0.12em] text-faint uppercase transition-colors hover:text-ink"
        >
          <ArrowLeft aria-hidden className="size-3" />
          Change my answers
        </a>
      </div>

      {/* The one surface on the page. Somewhere to land, and a frame for the two
          numbers everybody scrolled here to read. */}
      <Rise className="mt-3">
        <div className="rounded-[22px] bg-panel-bg px-5 py-7 sm:px-8 sm:py-9">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,240px)] lg:gap-12">
            <div>
              <p className="font-mono text-[9.5px] font-bold tracking-[0.14em] text-brand uppercase">
                Package match
              </p>

              <h1 className="mt-2.5 text-[32px] leading-[1.05] font-extrabold tracking-[-0.03em] sm:text-[44px] lg:text-[52px]">
                <span className="text-brand-gradient">{result.tier}</span>
              </h1>

              <p className="mt-2.5 max-w-[500px] text-[14.5px] leading-[1.65] text-body">
                {result.why}
              </p>

              <dl className="mt-7 flex flex-wrap gap-x-10 gap-y-5">
                <Figure
                  label="Build"
                  value={formatPrice(result.low, result.high)}
                />
                <Figure
                  label="Timeline"
                  value={`${fromWeeks} to ${toWeeks}`}
                  suffix="weeks"
                />
                <Figure
                  label="Care"
                  value={`£${carePlan?.price ?? CARE_TEASER.plans[0].price}`}
                  suffix="/ month"
                />
              </dl>

              <p className="mt-6 font-mono text-[10px] leading-[1.6] tracking-[0.03em] text-faint">
                {PRICING_NOTE}
              </p>
            </div>

            {/* Readiness. A number and a line, not a gauge: it is one figure out
                of a hundred and anything more would be dressing it up. */}
            <div className="lg:self-start">
              <div className="flex items-baseline justify-between gap-3">
                <Label>Readiness</Label>
                <p className="text-[22px] leading-none font-extrabold tabular-nums">
                  <CountUp to={gaps.score} />
                  <span className="text-[12px] font-semibold text-faint">
                    /100
                  </span>
                </p>
              </div>

              <GrowBar percent={gaps.score} trackClassName="mt-3" />

              <dl className="mt-4 flex flex-col gap-2">
                {[
                  { label: "You already have", value: gaps.have },
                  { label: "We will provide", value: gaps.missing },
                  {
                    label: "To check together",
                    value: gaps.unsure + gaps.outstanding,
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-baseline justify-between gap-3 text-[12.5px]"
                  >
                    <dt className="text-body">{row.label}</dt>
                    <dd className="font-mono font-bold tabular-nums">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </Rise>

      {/* Everything below sits on the page. Two columns of type, held apart by
          space, in the order the questions get asked: what are we building, how
          much of it, how long, and who looks after it. */}
      <div className="mt-12 grid gap-11 sm:mt-14 lg:grid-cols-2 lg:gap-x-14 lg:gap-y-14">
        <Reveal>
          <Block
            label="Derived sitemap"
            meta={pluralise(result.sitemap.length, "page")}
          >
            <p className="max-w-[420px] text-[13px] leading-[1.6] text-body">
              Worked out from what the site has to do. Confirm it, or tell us what
              is missing.
            </p>

            <ol className="mt-5 grid grid-cols-3 gap-x-3 gap-y-4 sm:grid-cols-4">
              {result.sitemap.map((page, at) => (
                <PageGlyph key={page} name={page} at={at} />
              ))}
            </ol>
          </Block>
        </Reveal>

        <Reveal index={1}>
          <Block
            label="Component scope"
            meta={`${pluralise(result.components.length, "item")} · ${result.points} pts`}
          >
            <ul className="flex flex-col gap-3.5">
              {result.bySection.map((section) => {
                const share = result.points
                  ? (section.points / result.points) * 100
                  : 0;

                return (
                  <li key={section.step}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="min-w-0 flex-1 truncate text-[13px] font-semibold">
                        {section.step}
                      </span>
                      <span className="font-mono text-[9.5px] text-faint tabular-nums">
                        {section.count} · {section.points}
                      </span>
                    </div>

                    <GrowBar
                      percent={share}
                      className="bg-brand/60"
                      trackClassName="mt-1.5"
                    />
                  </li>
                );
              })}
            </ul>
          </Block>
        </Reveal>

        <Reveal index={2}>
          <Block label="Timeline" meta={`${fromWeeks} to ${toWeeks} weeks`}>
            <ol className="flex flex-col gap-3.5">
              {PHASES.map((phase, at) => (
                <li key={phase.name} className="flex items-baseline gap-3">
                  <span className="font-mono text-[9.5px] font-bold text-brand tabular-nums">
                    {String(at + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="text-[13px] font-bold">{phase.name}</span>
                    <span className="ml-2 text-[12.5px] text-faint">
                      {phase.detail}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </Block>
        </Reveal>

        <Reveal index={3}>
          <Block label="Care recommendation" meta={result.care}>
            <p className="text-[13px] leading-[1.6] text-body">
              {carePlan?.body}
            </p>

            {carePlan ? (
              <ul className="mt-4 flex flex-col gap-2">
                {carePlan.points.map((point) => (
                  <li
                    key={point.label}
                    className="flex items-start gap-2 text-[13px] leading-[1.5] text-body"
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

            <p className="mt-5 flex items-center gap-1.5 font-mono text-[9.5px] tracking-[0.08em] text-faint uppercase">
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

      {/* The written plan is the next artefact, so this hands over by email rather
          than promising a page that is not built. */}
      <Reveal delay={0.1} className="mt-14 text-center sm:mt-16">
        <h2 className="text-[21px] font-extrabold tracking-[-0.02em] sm:text-[25px]">
          Happy with this? Let&rsquo;s make it a plan.
        </h2>

        <p className="mx-auto mt-3 max-w-[480px] text-[14px] leading-[1.65] text-body">
          Send it over and we will come back with your written website plan: the
          same figures, in full, with what we would do and in what order.
        </p>

        <div className="mt-7 flex flex-col items-stretch justify-center gap-2.5 sm:flex-row sm:items-center sm:gap-3">
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
      </Reveal>
    </Container>
  );
}
