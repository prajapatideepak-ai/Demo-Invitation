import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { weddingConfig } from "../config/weddingConfig";
import { useActiveSection } from "../hooks/useScrollReveal";
import { cn } from "../utils/cn";
import { scrollToSection } from "../utils/scroll";

const NAV_LINKS: Array<{ id: string; label: string }> = [
  { id: "home", label: "Home" },
  { id: "countdown", label: "Countdown" },
  { id: "events", label: "Functions" },
  { id: "story", label: "Our Story" },
  { id: "gallery", label: "Gallery" },
  { id: "venue", label: "Venue" },
];

const SECTION_IDS = NAV_LINKS.map((link) => link.id);
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Sticky single-page navigation. Links scroll smoothly to section ids —
 * no router, no page reloads. Collapses into a compact menu on mobile.
 */
export function Navbar({ visible }: { visible: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(SECTION_IDS);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Never leave the mobile drawer open when the layout becomes desktop.
  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const listener = () => {
      if (query.matches) setMenuOpen(false);
    };
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);

  const goTo = (id: string) => {
    setMenuOpen(false);
    scrollToSection(id);
  };

  return (
    <motion.header
      initial={{ y: -72, opacity: 0 }}
      animate={visible ? { y: 0, opacity: 1 } : { y: -72, opacity: 0 }}
      transition={{ duration: 0.8, delay: visible ? 0.15 : 0, ease: EASE }}
      className={cn(
        "fixed inset-x-0 top-0 z-40",
        !visible && "pointer-events-none",
      )}
    >
      <div
        className={cn(
          "transition-colors duration-500",
          scrolled || menuOpen
            ? "glass-panel shadow-[0_18px_50px_-40px_rgba(0,0,0,0.75)]"
            : "border-b border-transparent",
        )}
      >
        <nav
          className="shell flex items-center justify-between gap-4 py-2.5"
          aria-label="Wedding sections"
        >
          <button
            type="button"
            onClick={() => goTo("home")}
            className="flex items-center gap-3 rounded-full px-1 py-1"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full border border-line">
              <span className="script gold-text text-lg leading-none">
                {weddingConfig.partnerOne.charAt(0)}
                <span className="mx-[1px] text-[0.7em]">&amp;</span>
                {weddingConfig.partnerTwo.charAt(0)}
              </span>
            </span>
            <span className="hidden text-left sm:block">
              <span className="block font-display text-sm leading-none text-ink">
                {weddingConfig.partnerOne} &amp; {weddingConfig.partnerTwo}
              </span>
              <span className="block text-[0.6rem] uppercase tracking-[0.28em] text-ink-soft">
                {weddingConfig.dateLabel}
              </span>
            </span>
          </button>

          <ul className="hidden items-center gap-0.5 md:flex">
            {NAV_LINKS.map((link) => {
              const isActive = active === link.id;
              return (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => goTo(link.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "relative rounded-full px-3.5 py-2 text-[0.68rem] font-medium uppercase tracking-[0.18em] transition-colors",
                      isActive ? "text-accent" : "text-ink-soft hover:text-ink",
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0 rounded-full border border-line bg-surface/70"
                        transition={{ type: "spring", stiffness: 340, damping: 32 }}
                      />
                    )}
                    <span className="relative">{link.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink md:hidden"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
          </button>
        </nav>

        <AnimatePresence initial={false}>
          {menuOpen && (
            <motion.div
              id="mobile-nav"
              key="mobile-nav"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="overflow-hidden md:hidden"
            >
              <ul className="shell grid grid-cols-2 gap-2 pb-4 pt-1">
                {NAV_LINKS.map((link) => (
                  <li key={link.id}>
                    <button
                      type="button"
                      onClick={() => goTo(link.id)}
                      className={cn(
                        "w-full rounded-2xl border border-line px-4 py-3 text-left text-[0.7rem] font-medium uppercase tracking-[0.18em]",
                        active === link.id
                          ? "bg-accent-soft text-accent"
                          : "bg-surface/70 text-ink-soft",
                      )}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="h-[2px] origin-left bg-gradient-to-r from-accent to-gold-soft"
      />
    </motion.header>
  );
}

export default Navbar;
