"use client";

import { useState } from "react";
import { Check } from "lucide-react";

import { NEWSLETTER, SITE } from "@/lib/content/site";

/**
 * Newsletter signup.
 *
 * There is no list or backend yet, so rather than fake a subscription this opens
 * the visitor's mail client with the request already written. It does something
 * real, and it is one function to swap for a server action once a list exists.
 */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;

    const body = `Please add me to the newsletter: ${email.trim()}`;

    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(
      "Newsletter signup",
    )}&body=${encodeURIComponent(body)}`;

    setSent(true);
  }

  if (sent) {
    return (
      <p className="flex items-center gap-2 rounded-pill bg-white/8 px-4 py-2.5 text-[13px] font-semibold text-white">
        <Check aria-hidden className="size-4 text-accent-emerald" strokeWidth={3} />
        Your mail app is open, just hit send.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex rounded-pill bg-white/8 p-1">
      <input
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder={NEWSLETTER.placeholder}
        aria-label="Email address"
        className="min-w-0 flex-1 bg-transparent px-4 text-[13px] text-white outline-none placeholder:text-white/40"
      />

      <button
        type="submit"
        className="shrink-0 rounded-pill bg-white px-4 py-2 text-[12.5px] font-bold whitespace-nowrap text-ink transition-opacity hover:opacity-85"
      >
        {NEWSLETTER.action}
      </button>
    </form>
  );
}
