import { SectionShell } from "@/components/shared";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ } from "@/lib/content/faq";

export function FaqSection() {
  return (
    <SectionShell
      id="questions"
      eyebrow="Questions"
      title="The things people ask before they book"
      lead="If the answer you need is not here, ask it on the call. There is no obligation attached to a scope call."
      tone="surface"
      containerClassName="max-w-[900px]"
    >
      <Accordion type="single" collapsible className="w-full">
        {FAQ.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger className="text-left text-[15px] font-bold sm:text-base">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-[13.5px] leading-[1.7] text-ink-3">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </SectionShell>
  );
}
