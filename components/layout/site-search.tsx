"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

const NEVER_CHANGES = () => () => {};

const isMac = () =>
  /mac|iphone|ipad/i.test(navigator.platform || navigator.userAgent);

/**
 * The search field in the header.
 *
 * A form rather than a live dropdown. Forty eight pages is a size where a results
 * page is honest and a floating panel of predictions is theatre: the results page
 * can be linked to, shared, and reached with a keyboard, and it is the same screen
 * whether you arrived by typing or by clicking Search.
 *
 * The shortcut is the convention every documentation site has settled on, and the
 * hint is drawn rather than described so it reads as a key.
 */
export function SiteSearch({ className }: { className?: string }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);

  /* The platform never changes, so it is read rather than watched: an empty
     subscribe, the real answer on the client, and Ctrl on the server so the two
     renders agree and the key name is corrected on hydration. */
  const mac = useSyncExternalStore(NEVER_CHANGES, isMac, () => false);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        input.current?.focus();
        input.current?.select();
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <form
      role="search"
      className={className}
      onSubmit={(event) => {
        event.preventDefault();

        const query = input.current?.value.trim() ?? "";
        router.push(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
      }}
    >
      <div className="flex h-8 items-center gap-2 rounded-field border border-border bg-well px-2.5 transition-colors focus-within:border-active">
        <Search aria-hidden className="size-3.5 shrink-0 text-label" />

        <input
          ref={input}
          type="search"
          name="q"
          aria-label="Search this website"
          placeholder="Search this website"
          className="min-w-0 flex-1 bg-transparent text-[13px] text-body outline-none placeholder:text-label [&::-webkit-search-cancel-button]:appearance-none"
        />

        <kbd
          aria-hidden
          className="hidden shrink-0 rounded-[5px] border border-border bg-field px-1.5 py-px font-mono text-[9.5px] font-semibold text-label 2xl:block"
        >
          {mac ? "⌘K" : "CtrlK"}
        </kbd>
      </div>
    </form>
  );
}
