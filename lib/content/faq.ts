export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQ: readonly FaqItem[] = [
  {
    id: "is-it-a-quote",
    question: "Is the number on this page a quote?",
    answer:
      "No, and it is deliberately shown as a range so it cannot be mistaken for one. It is a pre estimator: it tells you the order of magnitude before you spend time on a call. The fixed figure comes after the 30 minute scope call, once we know what you actually need.",
  },
  {
    id: "why-a-range",
    question: "Why a range instead of one figure?",
    answer:
      "Because two businesses can tick the same boxes and still need different amounts of work. The range is roughly 15 percent either side of the ticked total, which is honest about how much a scope call can move things.",
  },
  {
    id: "how-long",
    question: "How long does a build take?",
    answer:
      "The timeline steps up with the scope, from one to two weeks for a small site to twelve weeks and beyond for a custom platform. The estimator shows the indicative window for whatever you have ticked. Content from your side is usually what decides it.",
  },
  {
    id: "who-owns-it",
    question: "Do I own the site?",
    answer:
      "Yes. The domain, the site and the content are yours. A care plan is a service, not a lock in, and cancelling it does not affect your ownership of anything.",
  },
  {
    id: "care-plan",
    question: "Do I have to take a care plan?",
    answer:
      "No. Plenty of clients self manage after launch. A plan buys hosting, security, backups and a monthly slot for edits, so it is mostly about not having to think about any of that. It is never part of the build total.",
  },
  {
    id: "add-later",
    question: "Can I add things later?",
    answer:
      "Yes, and the site is built expecting it. Adding a service, a page type or an integration later is adding to what is there, not rebuilding it. That is the whole reason we agree structure before design.",
  },
  {
    id: "copy",
    question: "Do you write the words?",
    answer:
      "We can do any of three things: tidy the copy you provide, rewrite your most important pages, or write the whole site with you. All three are options in the estimator, so you can see what each costs before deciding.",
  },
  {
    id: "existing-site",
    question: "I already have a site. Can you work with it?",
    answer:
      "Usually yes. Bring it to the scope call. Sometimes the right answer is a rebuild, sometimes it is fixing the three things holding it back. We will tell you which, even when the second one is the smaller job.",
  },
] as const;
