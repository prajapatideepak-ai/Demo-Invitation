/** Tiny class name joiner — keeps conditional class lists readable. */
export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

export default cn;
