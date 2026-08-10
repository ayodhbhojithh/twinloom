/* ---------------------------------------------------------------------------
   Where a submission's files live, said once.

   The path is built in two places - the route that signs an upload decides it,
   and the notification has to point at it - and it was written out in the first
   and half-remembered in the second, which is how an email ends up naming a
   folder nobody can find. One function, two callers.
--------------------------------------------------------------------------- */

/** The account's own root, and the default the signing route falls back to. */
const ROOT = () => process.env.CLOUDINARY_FOLDER ?? "twinloom/scoping";

/**
 * The folder for one desk, and somewhere to press.
 *
 * The path is the certain half: it is what the signing route wrote, and it is
 * what somebody types into the media library's search box to find the files.
 *
 * The link is the useful half and the less certain one. Cloudinary's console
 * has moved its folder addressing more than once, and a link built on a guess
 * is worse than no link - so this uses the search route, which has outlived
 * every layout the console has had, and it is only offered when the cloud name
 * is actually configured. If your console opens somewhere else, this is the one
 * line to change.
 */
export function mediaFolder(desk: string): { path: string; url?: string } {
  const path = `${ROOT()}/${desk}`;
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  return {
    path,
    url: cloud
      ? `https://console.cloudinary.com/console/${encodeURIComponent(
          cloud,
        )}/media_library/search?q=${encodeURIComponent(`folder:${path}`)}`
      : undefined,
  };
}
