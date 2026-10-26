import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Scroll reveal helpers built on IntersectionObserver.
 * Cheaper than animating everything on the main thread: each element is
 * observed once, and the observer disconnects as soon as it has fired
 * (when `once` is true).
 */

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const listener = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);

  return reduced;
}

export interface ScrollRevealOptions {
  /** 0–1, how much of the element must be visible before revealing. */
  threshold?: number;
  rootMargin?: string;
  /** Reveal only the first time (default) or every time it re-enters. */
  once?: boolean;
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions = {},
): { ref: RefObject<T | null>; isVisible: boolean } {
  const { threshold = 0.18, rootMargin = "0px 0px -10% 0px", once = true } = options;
  const ref = useRef<T | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Guests who prefer reduced motion simply see the content.
    if (reducedMotion) {
      setIsVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion, threshold, rootMargin, once]);

  return { ref, isVisible };
}

/**
 * Tracks which section is currently in view, for highlighting the
 * navigation link. Uses a scroll listener rather than an observer so the
 * "closest to the top" section always wins, even in the gaps between
 * sections.
 */
export function useActiveSection(ids: string[], offset = 96): string {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    let frame = 0;

    const compute = () => {
      frame = 0;
      let current = ids[0] ?? "";
      const scrollPosition = window.scrollY + offset + 1;

      ids.forEach((id) => {
        const element = document.getElementById(id);
        if (!element) return;
        if (element.offsetTop <= scrollPosition) current = id;
      });

      // Pin the last section when the page is scrolled to the very bottom.
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 4) {
        current = ids[ids.length - 1] ?? current;
      }

      setActive(current);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids, offset]);

  return active;
}

export default useScrollReveal;
