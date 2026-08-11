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
