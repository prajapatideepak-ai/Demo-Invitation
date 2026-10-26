/** Height of the sticky navigation bar, used as a scroll offset. */
export const NAV_OFFSET = 72;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Smoothly scroll to a section by id. Falls back to an instant jump for
 * guests who prefer reduced motion, and compensates for the sticky navbar.
 */
export function scrollToSection(id: string): void {
  if (typeof document === "undefined") return;

  if (id === "home") {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    return;
  }

  const target = document.getElementById(id);
  if (!target) return;

  const top = target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
  window.scrollTo({
    top: Math.max(top, 0),
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  });
}
