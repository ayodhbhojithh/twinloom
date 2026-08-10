import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
