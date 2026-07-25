import { Panel, SectionShell } from "@/components/shared";
import { PROCESS } from "@/lib/content/process";

export function ProcessSection() {
  return (
    <SectionShell
      id="how-it-works"
      eyebrow="How it works"
      title="Six steps, and you already did the first one"
      lead="Structure gets agreed before anything is designed. It is the cheapest place to change your mind, and the reason builds do not drift."
      tone="surface"
    >
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PROCESS.map((step) => (
          <li key={step.number}>
            <Panel className="flex h-full flex-col gap-2.5 p-5">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[22px] font-semibold tracking-[-0.02em] text-brand/45 tabular-nums">
                  {step.number}
                </span>
                <h3 className="text-[16px] font-extrabold tracking-[-0.01em]">
                  {step.title}
                </h3>
              </div>

              <p className="text-[13.5px] leading-[1.6] text-ink-3">
                {step.body}
              </p>

              <p className="mt-auto pt-2 font-mono text-[10px] tracking-[0.08em] text-ink-5 uppercase">
                {step.when}
              </p>
            </Panel>
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}
