import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Clock, MapPin, Sparkles } from "lucide-react";
import { useCountdown } from "../hooks/useCountdown";
import { weddingConfig } from "../config/weddingConfig";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function TimeTile({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, "0");

  return (
    <div className="card-royal relative flex flex-col items-center gap-1 overflow-hidden px-2 py-6 sm:py-8">
      <span
        aria-hidden="true"
        className="pattern-jaali pointer-events-none absolute inset-0 opacity-10"
      />
      <span className="corner-ornament corner-tl hidden sm:block" aria-hidden="true" />
      <span className="corner-ornament corner-br hidden sm:block" aria-hidden="true" />

      <span className="relative block h-11 overflow-hidden sm:h-16">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={display}
            initial={{ y: "-70%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "70%", opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="block font-display text-4xl font-semibold tabular-nums text-primary sm:text-6xl"
          >
            {display}
          </motion.span>
        </AnimatePresence>
      </span>

      <span className="text-[0.58rem] uppercase tracking-[0.3em] text-ink-soft sm:text-[0.66rem]">
        {label}
      </span>
    </div>
  );
}

/**
 * Wedding countdown. Numbers tick every second with React Hooks and are
 * recomputed from the target ISO timestamp, so the remaining time is
 * correct in every timezone and after the tab has been backgrounded.
 */
export function Countdown() {
  const { days, hours, minutes, seconds, isComplete, isInvalid } = useCountdown(
    weddingConfig.weddingDate,
  );

  const units = [
    { label: "Days", value: days },
    { label: "Hours", value: hours },
    { label: "Minutes", value: minutes },
    { label: "Seconds", value: seconds },
  ];

  const readableRemaining = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;

  return (
    <section
      id="countdown"
      className="section-pad relative overflow-hidden bg-bg-alt"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-line opacity-60"
      />
      <div
        aria-hidden="true"
        className="anim-spin-slow pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-line opacity-50"
      />
      <div
        aria-hidden="true"
        className="pattern-jaali pointer-events-none absolute inset-0 opacity-10"
      />

      <div className="shell relative flex flex-col items-center gap-12">
        <SectionHeading
          eyebrow="Save the Date"
          title="Counting Down to Forever"
          subtitle={`${weddingConfig.dayLabel}, ${weddingConfig.dateLabel} · ${weddingConfig.venue.name}, ${weddingConfig.city}`}
        />

        {isInvalid ? (
          <p role="alert" className="text-sm text-ink-soft">
            The wedding date in the configuration file could not be read.
          </p>
        ) : (
          <div
            role="timer"
            aria-label={`Time until the wedding: ${readableRemaining}`}
            className="grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5"
          >
            {units.map((unit) => (
              <TimeTile key={unit.label} value={unit.value} label={unit.label} />
            ))}
          </div>
        )}

        {isComplete ? (
          <Reveal className="flex flex-col items-center gap-3 text-center">
            <Sparkles className="h-6 w-6 text-accent" strokeWidth={1.5} />
            <p className="script gold-text text-4xl sm:text-5xl">
              Today is the day
            </p>
            <p className="max-w-md text-sm text-ink-soft">
              The wait is over — the celebrations begin. See you at the mandap.
            </p>
          </Reveal>
        ) : (
          <Reveal
            delay={0.15}
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[0.7rem] uppercase tracking-[0.2em] text-ink-soft"
          >
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-3.5 w-3.5 text-accent" strokeWidth={1.6} />
              {weddingConfig.dayLabel}, {weddingConfig.dateLabel}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-accent" strokeWidth={1.6} />
              {weddingConfig.venue.timeLabel}
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-accent" strokeWidth={1.6} />
              {weddingConfig.city}
            </span>
          </Reveal>
        )}
      </div>
    </section>
  );
}

export default Countdown;
