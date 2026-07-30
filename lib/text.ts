/** "result" or "results". Enough pluralising for a site that counts small things. */
export function pluralWord(count: number, singular: string, plural?: string) {
  return count === 1 ? singular : (plural ?? `${singular}s`);
}
