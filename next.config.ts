import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* `/partners` became `/services`.

     A permanent redirect rather than a deleted route: the old address is in
     the sitemap Google already crawled, and a 404 throws away whatever the URL
     had earned. */
  async redirects() {
    return [{ source: "/partners", destination: "/services", permanent: true }];
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
