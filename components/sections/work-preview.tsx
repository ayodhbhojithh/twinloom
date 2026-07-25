import type { WorkItem } from "@/lib/content/home";

/**
 * An abstract wireframe of what was built, not a screenshot of it.
 *
 * 2a makes this call and it is the right one. A real screenshot at card size is
 * unreadable, goes stale the moment the client edits their own site, and needs an
 * image request per card. A suggestion of the layout reads as "this is a shop" or
 * "this is a booking flow" instantly, weighs nothing, and never rots.
 *
 * Each variant is tinted to its own accent, so the three cards read as three
 * different pieces of work rather than one template repeated.
 */
export function WorkPreview({ preview }: { preview: WorkItem["preview"] }) {
  if (preview === "shop") {
    return (
      <div className="flex aspect-[4/2.5] flex-col gap-2 bg-[#ecfdf5] p-[18px]">
        <div className="h-[13px] w-[55%] rounded-[5px] bg-accent-emerald/85" />
        <div className="h-[7px] w-[80%] rounded-[5px] bg-[#a7f3d0]" />

        {/* The product row, pinned to the bottom edge of the frame. */}
        <div className="mt-auto flex gap-[7px]">
          <div className="h-[38px] flex-1 rounded-[8px] bg-white" />
          <div className="h-[38px] flex-1 rounded-[8px] bg-white" />
          <div className="h-[38px] flex-1 rounded-[8px] bg-white" />
        </div>
      </div>
    );
  }

  if (preview === "booking") {
    return (
      <div className="grid aspect-[4/2.5] grid-cols-2 gap-2 bg-[#eff6ff] p-[18px]">
        <div className="flex flex-col gap-[7px]">
          <div className="h-3 w-[85%] rounded-[5px] bg-accent-blue/85" />
          <div className="h-[7px] w-[90%] rounded-[5px] bg-[#bfdbfe]" />
          <div className="mt-[7px] h-[26px] w-[55%] rounded-pill bg-brand/90" />
        </div>

        {/* The slot picker: a white card with a list of times in it. */}
        <div className="flex flex-col gap-1.5 rounded-[10px] bg-white p-[9px]">
          <div className="h-[7px] w-[70%] rounded-[4px] bg-line" />
          <div className="h-[21px] rounded-[6px] bg-[#eff6ff]" />
          <div className="h-[21px] rounded-[6px] bg-[#eff6ff]" />
          <div className="h-[21px] rounded-[6px] bg-[#eff6ff]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex aspect-[4/2.5] flex-col gap-2 bg-[#f5f3ff] p-[18px]">
      <div className="h-3 w-[45%] rounded-[5px] bg-accent-violet/90" />

      <div className="mt-[5px] flex gap-[7px]">
        <div className="h-[42px] flex-1 rounded-[8px] bg-white" />
        <div className="h-[42px] flex-1 rounded-[8px] bg-white" />
      </div>

      <div className="mt-auto h-[26px] rounded-[8px] bg-linear-to-r from-accent-violet to-accent-pink opacity-85" />
    </div>
  );
}

/** The browser chrome above every preview, three dots and a hairline. */
export function PreviewChrome() {
  return (
    <div
      aria-hidden
      className="flex gap-[5px] border-b border-line/70 px-3.5 py-2.5"
    >
      <span className="size-2 rounded-pill bg-[#fda4af]" />
      <span className="size-2 rounded-pill bg-[#fcd34d]" />
      <span className="size-2 rounded-pill bg-[#6ee7b7]" />
    </div>
  );
}
