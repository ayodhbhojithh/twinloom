"use client";

import { useState } from "react";
import { ArrowUpRight, Link2, Plus, X } from "lucide-react";

import { PanelSection } from "./panel-section";
import { SectionCount } from "./section-count";
import { useThoughtsSession } from "./thoughts-context";

/**
 * Websites you like. The note matters more than the link: the plan quotes the
 * client's own reason back to them.
 *
 * The two fields are one stacked pair rather than two boxed inputs, so the pair
 * reads as one entry being composed. The add button only becomes live once there
 * is an address, which is the same rule as pressing Enter in the note.
 */
export function LinksSection() {
  const { links, addLink, removeLink } = useThoughtsSession();
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");

  function submit() {
    if (!url.trim()) return;
    addLink(url, note);
    setUrl("");
    setNote("");
  }

  return (
    <PanelSection
      label="Websites you like"
      icon={<Link2 className="size-3.5" />}
      active={links.length > 0}
      meta={<SectionCount value={links.length} />}
    >
      <div className="flex flex-col gap-2">
        <input
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="a-site-you-like.com"
          aria-label="Website address"
          spellCheck={false}
          className="h-9 w-full rounded-btn-sm bg-panel-bg px-3 text-[12px] outline-none ring-inset transition-shadow placeholder:text-faint focus:ring-1 focus:ring-brand/45"
        />

        <div className="flex gap-2">
          <input
            value={note}
            onChange={(event) => setNote(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                submit();
              }
            }}
            placeholder="What do you like about it?"
            aria-label="What you like about it"
            className="h-9 min-w-0 flex-1 rounded-btn-sm bg-panel-bg px-3 text-[12px] outline-none ring-inset transition-shadow placeholder:text-faint focus:ring-1 focus:ring-brand/45"
          />
          <button
            type="button"
            onClick={submit}
            disabled={!url.trim()}
            aria-label="Add website"
            className="flex size-9 shrink-0 items-center justify-center rounded-btn-sm bg-brand text-white transition-all hover:opacity-90 disabled:opacity-35"
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>

      {links.length ? (
        <ul className="mt-2.5 flex flex-col gap-2">
          {links.map((link) => (
            <li
              key={link.id}
              className="group/link flex items-start gap-2 rounded-btn-sm bg-panel-bg p-2.5"
            >
              <span
                aria-hidden
                className="mt-px flex size-6 shrink-0 items-center justify-center rounded-nav bg-white text-brand shadow-card"
              >
                <Link2 className="size-3" />
              </span>

              <div className="min-w-0 flex-1">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-1 text-[12px] font-bold text-brand hover:underline"
                >
                  <span className="truncate">
                    {link.url.replace(/^https?:\/\//, "")}
                  </span>
                  <ArrowUpRight aria-hidden className="size-3 shrink-0" />
                </a>
                {link.note ? (
                  <p className="mt-1 text-[11.5px] leading-[1.45] text-body">
                    {link.note}
                  </p>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => removeLink(link.id)}
                aria-label={`Remove ${link.url}`}
                className="flex size-6 shrink-0 items-center justify-center rounded-nav text-faint opacity-60 transition-all group-hover/link:opacity-100 hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="size-3" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </PanelSection>
  );
}
