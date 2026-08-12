/** Tiny className joiner. No dependency needed for a prototype of this size. */
export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}
