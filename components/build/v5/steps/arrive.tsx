"use client";

import Link from "next/link";

import { ROUTES } from "@/lib/site";

import { Aside, SubHead, Under } from "../parts";
import { Lead, Say, StepFrame } from "../step-frame";

/**
 * Step one: what this is, and that you can stop whenever you like.
 *
 * It asks nothing. That is deliberate and it is why the step exists: the first
 * thing anybody meets is what they are agreeing to spend, not a question.
 */
export function StepArrive({
  at,
  onGo,
}: {
  at: number;
  onGo: (at: number) => void;
}) {
  return (
    <StepFrame
      at={at}
      onGo={onGo}
      needs="Nothing."
      showBack="The eleven things every website includes, on a page of their own."
    >
      <Lead>
        Read what this is, how long it takes, and that you can stop whenever you
        like.
      </Lead>

      <Say>
        Twelve steps, two of which you will be through in a minute, and only two
        of them compulsory. Nothing here is priced, nothing here is scored, and
        no answer you give locks anything in. At the end you read the whole thing
        back and decide whether to send it.
      </Say>

      <SubHead
        title="What every website includes"
        note="Eleven things, on every website we build. None of it is optional, none of it is an extra, and none of it is on a list for you to choose from. It is the floor."
      />

      <Aside label="Written out on its own page">
        <p>
          It is set out in full under <b>What every website includes</b>, so it
          is a thing you can read on its own and send to somebody else rather
          than something you have to scroll past to get started.
        </p>

        <Link
          href={ROUTES.site}
          className="inline-block rounded-field bg-field px-5 py-2.5 text-[14.5px] font-semibold text-ink transition-colors hover:bg-hair"
        >
          Read what every website includes
        </Link>
      </Aside>

      <Under>
        Everything you answer from here adds to that floor. It never replaces any
        of it, and it never takes any of it away. Your answers stay where they
        are while you read it.
      </Under>

      <SubHead
        title="What you get back"
        note="A written scope, in your words, inside two working days. It is a description of a website, not a quote, and nothing in it carries a figure."
      />

      <div className="grid max-w-wide gap-x-10 gap-y-4 lg:grid-cols-2">
        <Say>
          Every question here asks about your business. What we do with the
          answer is ours to work out, and you never have to think about it.
        </Say>
        <Say>
          Leave anything you like. An unanswered question is written down as an
          assumption, in its own section, so you can see exactly what we filled
          in and correct it.
        </Say>
      </div>
    </StepFrame>
  );
}
