/* ---------------------------------------------------------------------------
   How we work, as thirteen steps.

   Shown on the submit screen so somebody pressing send can see where that press
   lands: second of thirteen, with eleven still to come and every one of them
   named. A form that ends in "thank you" tells you nothing about what happens
   next, and this is the one moment a reader most wants to know.

   The state is fixed rather than derived. Sending a scoping request always puts
   you at the same place in the same process, so nothing here reads the answers.
--------------------------------------------------------------------------- */

export interface WorkStep {
  /** `done`, `here` or `ahead`. */
  state: string;
  ix: string;
  n: string;
  sub: string;
  /** What the right hand side of the row says. */
  mark: string;
}

export const HOW_WE_WORK: readonly WorkStep[] = [
 {
  "state": "done",
  "ix": "01",
  "n": "You tell us what it is for",
  "sub": "The run-through you have just done. Answer what you can and leave what you cannot.",
  "mark": "Done"
 },
 {
  "state": "here",
  "ix": "02",
  "n": "We read it, all of it",
  "sub": "Including the parts you wrote in your own words, which are usually the useful part.",
  "mark": "You are here"
 },
 {
  "state": "ahead",
  "ix": "03",
  "n": "We come back with the questions it raised",
  "sub": "Two or three of them, in writing, within two working days.",
  "mark": ""
 },
 {
  "state": "ahead",
  "ix": "04",
  "n": "We talk it through, half an hour",
  "sub": "We go through what we assumed and you tell us where we were wrong.",
  "mark": ""
 },
 {
  "state": "ahead",
  "ix": "05",
  "n": "The written scope",
  "sub": "Your document, corrected. Every screen, every answer and every assumption, named.",
  "mark": ""
 },
 {
  "state": "ahead",
  "ix": "06",
  "n": "You agree the scope",
  "sub": "Nothing moves until you do, and changing your mind at this point costs nothing.",
  "mark": ""
 },
 {
  "state": "ahead",
  "ix": "07",
  "n": "The price, against that scope",
  "sub": "Separately and in writing, with the VAT treatment stated and marked indicative until it is agreed.",
  "mark": ""
 },
 {
  "state": "ahead",
  "ix": "08",
  "n": "Design direction agreed",
  "sub": "How it will look and how it will feel, shown to you before anything is built.",
  "mark": ""
 },
 {
  "state": "ahead",
  "ix": "09",
  "n": "Words, pictures and access gathered",
  "sub": "The things only you can give us, listed one by one and ticked off as they arrive.",
  "mark": ""
 },
 {
  "state": "ahead",
  "ix": "10",
  "n": "Built in milestones, visible as it goes",
  "sub": "You watch it grow rather than seeing it once at the end.",
  "mark": ""
 },
 {
  "state": "ahead",
  "ix": "11",
  "n": "You review it on a real address",
  "sub": "A working website on a link of its own, with time to sit with it.",
  "mark": ""
 },
 {
  "state": "ahead",
  "ix": "12",
  "n": "Go live, and the accounts handed to you",
  "sub": "The domain, the hosting and the analytics in your name rather than ours.",
  "mark": ""
 },
 {
  "state": "ahead",
  "ix": "13",
  "n": "Early life support, then the care level you chose",
  "sub": "We stay close after go live, then settle into whatever level of care you picked.",
  "mark": ""
 }
];
