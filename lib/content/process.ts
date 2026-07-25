export interface ProcessStep {
  /** Two digit label, matching the mono numbering used through the prototype. */
  number: string;
  title: string;
  body: string;
  /** Roughly when this happens. Never a promise, always a shape. */
  when: string;
}

export const PROCESS: readonly ProcessStep[] = [
  {
    number: "01",
    title: "Price it yourself",
    body: "Tick the parts you want on this page. No form, no email gate, no waiting three days for a number.",
    when: "5 minutes, right now",
  },
  {
    number: "02",
    title: "A 30 minute scope call",
    body: "We go through what you ticked, tell you what we would drop, and what you have missed. You get a fixed proposal, not a range.",
    when: "Within a week",
  },
  {
    number: "03",
    title: "Structure before design",
    body: "Sitemap, page structure and the message on each page agreed first. Design decisions get much cheaper once this is settled.",
    when: "Week 1",
  },
  {
    number: "04",
    title: "Design and build",
    body: "Key pages designed, then built. You see it on a real URL as it goes, not in a PDF at the end.",
    when: "Weeks 2 to 6",
  },
  {
    number: "05",
    title: "Launch",
    body: "Domain, SSL, analytics, search console, redirects. We check it on real phones before it goes live, not after.",
    when: "Launch week",
  },
  {
    number: "06",
    title: "Care, if you want it",
    body: "Hosting, backups, updates and a monthly slot for edits. Cancel whenever. The site is yours either way.",
    when: "Ongoing, optional",
  },
] as const;
