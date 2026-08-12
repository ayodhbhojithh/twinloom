import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Where a build is written.
   *
   * `.next` by default, which is also where `next dev` keeps its own compiled
   * output - and the two cannot share it. A production build empties that
   * directory and writes a different set of manifests into it; the dev server is
   * watching those files, finds them replaced under it, and recompiles and
   * reloads the browser. What that looks like from the terminal is the page
   * being fetched over and over with nobody touching it.
   *
   * So anything that builds only to check the build - a type check, a
   * verification pass, CI - sets `NEXT_DIST_DIR` and gets its own directory,
   * and the dev server keeps `.next` to itself.
   */
  distDir: process.env.NEXT_DIST_DIR || ".next",

  /* `/partners` became `/services`, and `/services` has become a section of
     the home page rather than a page of its own.

     Both old addresses are in the sitemap Google already crawled, and a 404
     throws away whatever either URL had earned - so both are permanent
     redirects rather than deleted routes, and both land on the section that
     is now the whole of what either page said. */
  async redirects() {
    return [
      { source: "/partners", destination: "/#services", permanent: true },
      { source: "/services", destination: "/#services", permanent: true },
      /* `/blog` became `/insights`. The section has been called Insight in the
         bar for a while and the pieces link to each other by that name, so the
         address was the last thing still calling it a blog. Every old URL keeps
         whatever it had earned. */
      { source: "/blog", destination: "/insights", permanent: true },
      {
        source: "/blog/:slug",
        destination: "/insights/:slug",
        permanent: true,
      },
    ];
  },

  /* What the browser is told about this site before it renders any of it.

     None of these were set, which means every one of them was at the browser's
     default - and the defaults are permissive because they have to keep 1998
     working. Five headers, each closing one thing that has never been wanted
     here.

     No `Content-Security-Policy` among them, deliberately and not by oversight.
     A real one needs a per-request nonce on every inline script, which means
     giving up the static rendering that makes these pages arrive as fast as
     they do; a fake one - `unsafe-inline` in `script-src` - is the header
     without the protection, and worth less than nothing because it reads as
     done. `frame-ancestors` is the one part of CSP that has nothing to do with
     scripts, so it is set on its own below. */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          /* No sniffing. Without it a browser may decide a file we served as
             text is really a script, and run it. */
          { key: "X-Content-Type-Options", value: "nosniff" },

          /* The path leaks, the query string does not. A referrer carrying the
             full URL of the build page would hand whatever is in it to every
             site somebody clicks through to. */
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },

          /* Nobody frames this. Clickjacking a page whose main control sends a
             scoping request is a real thing to want to do, and the two headers
             are both here because the older one is what older browsers read. */
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },

          /* Everything off that this site does not do. The one exception is
             screen capture, which the colour studio asks for to take a colour
             off whatever is on the screen - so it is granted to this origin and
             to nothing embedded in it. */
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=(), display-capture=(self)",
          },

          /* Two years, subdomains included. A host usually sets this; setting
             it here means it holds wherever this is deployed rather than only
             where somebody remembered to tick the box. */
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },

  images: {
    /**
     * Next 16 requires every quality used anywhere in the app to be listed here.
     * It is an allowlist rather than a default so that nobody can hit the
     * optimiser with arbitrary values and make it render a thousand variants of
     * the same picture.
     *
     * 75 is the default and what most images should stay on. 100 is here for the
     * work photographs, which are the whole point of the pages they sit on and
     * are looked at rather than glanced past.
     */
    qualities: [75, 100],
  },
};

export default nextConfig;
