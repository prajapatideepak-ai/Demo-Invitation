import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Heart } from "lucide-react";
import { weddingConfig } from "../config/weddingConfig";
import { cn } from "../utils/cn";
import { scrollToSection } from "../utils/scroll";
import FloatingPetals from "./FloatingPetals";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Animates a word letter by letter (used for the couple's names). */
function Letters({
  text,
  delay = 0,
  className,
}: {
  text: string;
  delay?: number;
  className?: string;
}) {
  return (
    <span className={cn("inline-block", className)}>
      {text.split("").map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          className="inline-block"
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: delay + index * 0.06, ease: EASE }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

interface WelcomeSectionProps {
  /** False while the invitation cover is still closed. */
  opened: boolean;
  onOpen: () => void;
}

/**
 * Cinematic hero + full-screen invitation cover.
 * The cover sits on top of the page until the guest taps "Open
 * Invitation"; the hero underneath is what they land on afterwards.
 */
export function WelcomeSection({ opened, onOpen }: WelcomeSectionProps) {
  const {
    partnerOne,
    partnerTwo,
    welcomeMessage,
    invitationLine,
    dateLabel,
    dayLabel,
    city,
    heroImage,
    hashtag,
  } = weddingConfig;

  const overlayStyle = {
    background:
      "linear-gradient(180deg, color-mix(in srgb, var(--c-overlay) 65%, transparent) 0%, color-mix(in srgb, var(--c-overlay) 92%, transparent) 55%, var(--c-overlay) 100%)",
  };

  return (
    <>
      <section
        id="home"
        className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-primary-dark"
      >
        <img
          src={heroImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0" style={overlayStyle} />
        <FloatingPetals count={12} className="z-10" />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-3 z-10 rounded-[2rem] border border-white/20 sm:inset-6 lg:inset-8"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 pattern-jaali hidden opacity-20 sm:block"
        />

        <div className="relative z-20 flex w-full flex-col items-center px-6 text-center text-white">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
            className="eyebrow text-white/75"
          >
            {hashtag}
          </motion.p>

          <h1 className="script mt-4 text-[clamp(2.6rem,9vw,5.5rem)] leading-tight">
            <Letters text={partnerOne} delay={0.35} />
            <motion.span
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.95, ease: EASE }}
              className="mx-3 inline-block align-middle text-[0.5em] text-white/85"
            >
              <Heart className="inline h-[0.9em] w-[0.9em] fill-current" />
            </motion.span>
            <Letters text={partnerTwo} delay={1.05} />
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="mt-6 font-accent text-sm tracking-[0.42em] text-white/80 uppercase sm:text-base"
          >
            {dayLabel} · {dateLabel} · {city}
          </motion.p>

          <motion.button
            type="button"
            onClick={() => scrollToSection("countdown")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.8 }}
            className="mt-12 flex flex-col items-center gap-2 text-[0.62rem] uppercase tracking-[0.34em] text-white/75 transition hover:text-white"
          >
            Scroll to explore
            <motion.span
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="h-4 w-4" />
            </motion.span>
          </motion.button>
        </div>
      </section>

      <AnimatePresence>
        {!opened && (
          <motion.div
            key="invitation-cover"
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden px-5 py-10"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: "-10%", scale: 1.05 }}
            transition={{ duration: 0.95, ease: EASE }}
          >
            <img
              src={heroImage}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0" style={overlayStyle} />
            <FloatingPetals count={16} />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-4 rounded-[1.75rem] border border-white/25 sm:inset-8 lg:inset-14"
            />

            <div className="relative z-10 w-full max-w-2xl text-center text-white">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
                className="eyebrow justify-center text-white/80"
              >
                {welcomeMessage}
              </motion.p>

              <h1 className="script mt-5 text-[clamp(2.5rem,10vw,5rem)] leading-[1.1]">
                <Letters text={partnerOne} delay={0.5} />
                <motion.span
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 1.05, ease: EASE }}
                  className="mx-2 inline-block align-middle text-[0.5em] text-white/85"
                >
                  <Heart className="inline h-[0.9em] w-[0.9em] fill-current" />
                </motion.span>
                <Letters text={partnerTwo} delay={1.15} />
              </h1>

              <motion.div
                initial={{ opacity: 0, scaleX: 0.4 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 1, delay: 1.6, ease: EASE }}
                className="mx-auto mt-7 flex max-w-sm items-center gap-3"
              >
                <span className="h-px flex-1 bg-white/40" />
                <Heart className="h-3 w-3 text-white/70" strokeWidth={1.5} />
                <span className="h-px flex-1 bg-white/40" />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 1.75, ease: EASE }}
                className="mt-5 font-display text-base uppercase tracking-[0.32em] text-white/90 sm:text-lg"
              >
                {invitationLine}
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.9, delay: 1.95 }}
                className="mt-4 font-accent text-sm tracking-[0.3em] text-white/75 uppercase sm:text-base"
              >
                {dayLabel}, {dateLabel} · {city}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 2.15, ease: EASE }}
                className="mt-10 flex flex-col items-center"
              >
                <button type="button" onClick={onOpen} className="btn btn-solid">
                  Open Invitation
                  <Heart className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default WelcomeSection;
