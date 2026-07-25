"use client";

import { useState } from "react";
import { CornerDownLeft } from "lucide-react";

import { Input } from "@/components/ui/input";
import { SITE } from "@/lib/content/site";
import { estimateEmailBody } from "@/lib/scope";

import { useScope } from "../scope-context";

/**
 * Sends the estimate somewhere real. There is no backend, so rather than fake a
 * "sent" state this opens the visitor's mail client with the full ticked
 * breakdown already written out. Swap the submit handler for a server action
 * when an inbox or CRM is wired up.
 */
export function EstimateRequestForm() {
  const { selection, totals } = useScope();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [opened, setOpened] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const subject = `Website estimate: ${totals.tier.name}`;
    const body = estimateEmailBody(selection, totals, { name, email });

    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    setOpened(true);
  }

  if (opened) {
    return (
      <div className="mt-4 rounded-row border border-live/35 bg-live/8 p-3.5 font-mono text-[12px] leading-[1.6] text-live">
        ● your mail app should be open with this estimate written out. Send it and
        you get a human reply within one working day.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2.5">
      <Input
        name="name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Your name"
        aria-label="Your name"
        autoComplete="name"
        className="h-11 rounded-row border-hairline bg-sunken text-sm"
      />
      <Input
        type="email"
        name="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@company.com"
        aria-label="Your email"
        autoComplete="email"
        className="h-11 rounded-row border-hairline bg-sunken text-sm"
      />
      <button
        type="submit"
        className="flex h-12 items-center justify-center gap-2.5 rounded-row bg-brand px-4 text-[14.5px] font-bold text-white shadow-cta transition-opacity hover:opacity-90"
      >
        Email me this estimate
        <span
          aria-hidden
          className="flex items-center rounded-md bg-white/20 px-1.5 py-0.5"
        >
          <CornerDownLeft className="size-3" />
        </span>
      </button>
    </form>
  );
}
