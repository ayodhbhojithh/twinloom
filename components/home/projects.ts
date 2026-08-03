/* ---------------------------------------------------------------------------
   The work, as data.

   Placeholders until the real projects arrive, and named for what each build
   does rather than for a client. Inventing client names to fill a carousel would
   put fake credentials on a company's own site, which is the one lie a portfolio
   must not tell. These describe kinds of work, which is true of every one of
   them.

   The `tone` is the grey the picture sits in until there is a picture. Six
   slightly different greys rather than one, because a row of identical blocks
   reads as a loading state and a row of nearly identical ones reads as artwork
   that has not arrived.
--------------------------------------------------------------------------- */

export interface Project {
  id: string;
  name: string;
  kind: string;
  year: string;
  summary: string;
  facts: readonly { term: string; value: string }[];
  tone: string;
}

export const PROJECTS: readonly Project[] = [
  {
    id: "maker",
    name: "A shop for a maker",
    kind: "Selling direct",
    year: "2026",
    summary:
      "Somebody who makes things by hand and sells them to the public. The site had to carry the making as well as the buying, because the making is why anybody pays the price.",
    facts: [
      { term: "Pages", value: "11" },
      { term: "Built in", value: "5 weeks" },
      { term: "Visitors", value: "Customers" },
    ],
    tone: "#e9ebee",
  },
  {
    id: "trade",
    name: "A trade account portal",
    kind: "Selling to business",
    year: "2026",
    summary:
      "Buyers ordering on behalf of an organisation, with somebody above them to answer to. Everything on it exists so a buyer can take a decision back to a person who was never on the site.",
    facts: [
      { term: "Pages", value: "18" },
      { term: "Built in", value: "8 weeks" },
      { term: "Visitors", value: "Business buyers" },
    ],
    tone: "#e4e7ea",
  },
  {
    id: "investor",
    name: "An investor reporting site",
    kind: "Money and oversight",
    year: "2025",
    summary:
      "A quiet corner for people who put money in and the board that watches it. Dated, filed, and never more current than the paperwork behind it.",
    facts: [
      { term: "Pages", value: "9" },
      { term: "Built in", value: "4 weeks" },
      { term: "Visitors", value: "Investors" },
    ],
    tone: "#eceef1",
  },
  {
    id: "careers",
    name: "A careers site that fills roles",
    kind: "Hiring",
    year: "2025",
    summary:
      "Written for the people they wanted rather than the people who applied. What it is actually like to work there, said plainly, and a way to apply that takes four minutes.",
    facts: [
      { term: "Pages", value: "14" },
      { term: "Built in", value: "6 weeks" },
      { term: "Visitors", value: "Staff and candidates" },
    ],
    tone: "#e7e9ed",
  },
  {
    id: "press",
    name: "A press room",
    kind: "Media",
    year: "2025",
    summary:
      "The facts in one place, the logos in another, and a named person who answers within the day. Built for somebody on a deadline who has never heard of the company.",
    facts: [
      { term: "Pages", value: "7" },
      { term: "Built in", value: "3 weeks" },
      { term: "Visitors", value: "Press" },
    ],
    tone: "#eaecef",
  },
  {
    id: "governance",
    name: "A compliance library",
    kind: "Governance",
    year: "2024",
    summary:
      "Registrations, policies and certificates, findable without having to ask. The dated record of what was published when, which is the whole point of it.",
    facts: [
      { term: "Pages", value: "22" },
      { term: "Built in", value: "7 weeks" },
      { term: "Visitors", value: "Regulators" },
    ],
    tone: "#e6e8ec",
  },
];
