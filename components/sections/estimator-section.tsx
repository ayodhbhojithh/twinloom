import { ScopeEstimator } from "@/components/estimator";
import { Container, MonoLabel, ScriptNote } from "@/components/shared";
import { PRICING } from "@/lib/scope";

export function EstimatorSection() {
  return (
    <section
      id="estimator"
      aria-labelledby="estimator-title"
      className="scroll-mt-20 border-t border-hairline bg-canvas py-14 sm:py-18 lg:py-22"
    >
      <Container>
        <div className="max-w-[760px]">
          <MonoLabel>Price it yourself</MonoLabel>
          <h2
            id="estimator-title"
            className="mt-2 text-[26px] font-extrabold tracking-[-0.025em] text-balance sm:text-[32px] lg:text-[38px]"
          >
            The whole scope, on one table
          </h2>
          <p className="mt-3 text-[15px] leading-[1.6] text-ink-3 sm:text-base">
            Tick any mix. Options are features, not tiers, so a small site can
            still have the one thing it really needs. Click a block in the
            wireframe and the table jumps to that row.
          </p>
          <ScriptNote className="mt-2">
            nothing ticked means not included. Untick freely.
          </ScriptNote>
        </div>

        <div className="mt-8 sm:mt-10">
          <ScopeEstimator defaultLayout="blueprint" />
        </div>

        <p className="mt-6 max-w-[760px] text-[13px] leading-[1.7] text-ink-4">
          The figure is shown as a range because it is a pre estimator, not a
          quote. Both ends round to the nearest {PRICING.currency}
          {PRICING.roundTo}, and the range sits roughly{" "}
          {Math.round((PRICING.rangeHigh - 1) * 100)} percent either side of the
          ticked total. You get a fixed figure after the scope call, once we know
          what you actually need. Care plans are monthly and never part of the
          build total.
        </p>
      </Container>
    </section>
  );
}
