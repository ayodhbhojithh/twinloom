import { ImageResponse } from "next/og";

import { SITE } from "@/lib/site";

/**
 * The card every link to this site unfurls as.
 *
 * Generated rather than drawn, so it is written in the same words as the page
 * and cannot fall out of date with them. A static picture would be one more file
 * to remember when the tagline changes, and the tagline is the whole card.
 *
 * 1200 by 630 because that is what every platform crops from. Anything else gets
 * cut somewhere, and it is never the same edge twice.
 *
 * Flexbox only, and no grid: this is rendered by Satori into a PNG rather than
 * by a browser, and it supports a subset of CSS. Every element with more than
 * one child needs `display: flex` stated outright - the default is `block` in
 * CSS and Satori refuses it rather than guessing.
 */
export const alt = `${SITE.name} - ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#ffffff",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 999,
              border: "5px solid #111827",
            }}
          />
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 999,
              border: "5px solid #2563eb",
              marginLeft: -18,
            }}
          />
          <div
            style={{
              marginLeft: 14,
              fontSize: 34,
              fontWeight: 700,
              color: "#111827",
              letterSpacing: "-0.02em",
            }}
          >
            {SITE.name}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 68,
            lineHeight: 1.1,
            fontWeight: 800,
            color: "#111827",
            letterSpacing: "-0.035em",
            maxWidth: 940,
          }}
        >
          {SITE.tagline}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 24,
            color: "#565e6b",
          }}
        >
          <div style={{ display: "flex" }}>
            A written scope, in two working days.
          </div>
          {/* A bar of the one accent, where a photograph would be on a site
              that had one. The palette is the brand here. */}
          <div
            style={{
              display: "flex",
              width: 160,
              height: 8,
              borderRadius: 999,
              backgroundColor: "#2563eb",
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}
