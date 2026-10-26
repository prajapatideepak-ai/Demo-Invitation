import { motion } from "framer-motion";
import {
  CalendarDays,
  Clock,
  Crown,
  Flower2,
  MapPin,
  Music,
  Shirt,
  Sun,
  type LucideIcon,
} from "lucide-react";
import type { CSSProperties } from "react";
import type { EventDecor, EventIcon, WeddingEvent } from "../config/weddingEvents";
import { cn } from "../utils/cn";
import FloatingPetals from "./FloatingPetals";
import SparkleField from "./SparkleField";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const ICONS: Record<EventIcon, LucideIcon> = {
  sun: Sun,
  flower: Flower2,
  music: Music,
  crown: Crown,
};

interface VariantProps {
  event: WeddingEvent;
  index: number;
  total: number;
}

/** Scroll-triggered fade + rise, shared by every block inside a section. */
const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 34 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.1 },
  transition: { duration: 0.85, delay, ease: EASE },
});

/** Each function paints its own accent tokens on top of the page theme. */
function accentVars(event: WeddingEvent): CSSProperties {
  return {
    "--accent": event.colors.accent,
    "--accent-soft": event.colors.accentSoft,
    "--accent-deep": event.colors.accentDeep,
    "--accent-glow": event.colors.glow,
  } as CSSProperties;
}

function FunctionLabel({ event, index, total, className }: VariantProps & { className?: string }) {
  return (
    <span className={cn("eyebrow", className)} style={{ color: event.colors.accentDeep }}>
      <span className="hairline hidden w-10 sm:block" />
      Function {index + 1} of {total}
      <span className="hairline w-10" />
    </span>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-line bg-surface/80 px-3.5 py-3 shadow-sm transition hover:shadow-md">
      <Icon
        className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-deep,var(--c-accent))]"
        strokeWidth={1.8}
        aria-hidden="true"
      />
      <div className="min-w-0">
        <p className="text-[0.56rem] font-medium uppercase tracking-[0.26em] text-ink-soft opacity-80">
          {label}
        </p>
        <p className="font-accent text-[0.84rem] leading-snug text-ink">{value}</p>
      </div>
    </div>
  );
}

function Details({ event, className }: { event: WeddingEvent; className?: string }) {
  return (
    <div className={cn("grid gap-2.5 sm:grid-cols-2", className)}>
      <DetailRow icon={CalendarDays} label="Date" value={event.dateLabel} />
      <DetailRow icon={Clock} label="Time" value={event.timeLabel} />
      <DetailRow icon={MapPin} label="Venue" value={event.venue} />
      <DetailRow icon={Shirt} label="Dress code" value={event.dressCode} />
    </div>
  );
}

function ColourStory({ event, className }: { event: WeddingEvent; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <span
        className="rounded-full px-3 py-1 text-[0.54rem] font-medium uppercase tracking-[0.24em]"
        style={{
          backgroundColor: `${event.colors.accent}15`,
          color: event.colors.accentDeep,
        }}
      >
        Colour story
      </span>
      <div className="flex items-center gap-2">
        <div className="flex -space-x-1.5">
          {event.palette.map((swatch) => (
            <span
              key={swatch}
              title={swatch}
              className="h-4.5 w-4.5 rounded-full border-2 border-surface shadow-sm"
              style={{ background: swatch }}
            />
          ))}
        </div>
        <span className="font-accent text-[0.72rem] italic text-ink-soft">
          {event.colorStory}
        </span>
      </div>
    </div>
  );
}

/**
 * HALDI — warm sunlight, a marigold garland headline and an arch-framed
 * photograph, all centred around the turmeric ceremony.
 */
function MarigoldSection({ event, index, total }: VariantProps) {
  const Icon = ICONS[event.icon];

  return (
    <section
      id={event.id}
      style={accentVars(event)}
      className="relative scroll-mt-24 overflow-hidden bg-bg-alt"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: `radial-gradient(780px 420px at 10% 0%, ${event.colors.accentSoft} 0%, transparent 64%), radial-gradient(680px 380px at 92% 14%, ${event.colors.glow} 0%, transparent 62%)`,
        }}
      />
      <span aria-hidden="true" className="pattern-jaali absolute inset-0 opacity-[0.14]" />
      <FloatingPetals
        count={12}
        duration={20}
        colors={["#f0b429", "#e07a1f", "#f6d06a", "#ffd98a"]}
        className="opacity-70"
      />

      {/* marigold garland strung across the top of the section */}
      <div
        aria-hidden="true"
        className="relative flex h-9 items-center justify-center overflow-hidden"
      >
        {Array.from({ length: 42 }, (_, bead) => (
          <span
            key={bead}
            className="anim-sway -mx-[4px] h-4.5 w-4.5 shrink-0 rounded-full shadow-sm"
            style={{
              background: bead % 3 === 0 ? "#e07a1f" : "#f0b429",
              boxShadow: "inset 0 -3px 6px rgba(140, 70, 0, 0.3)",
              animationDelay: `-${(bead % 7) * 0.45}s`,
            }}
          />
        ))}
      </div>

      <div className="shell section-pad relative pt-10">
        <motion.div {...rise()} className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <FunctionLabel event={event} index={index} total={total} />
          <h2 className="section-title mt-4" style={{ color: event.colors.accentDeep }}>
            {event.title}
          </h2>
          <p className="script mt-2 text-3xl sm:text-4xl" style={{ color: event.colors.accent }}>
            {event.subtitle}
          </p>
          <p className="mt-4 max-w-xl font-accent text-base italic text-ink-soft sm:text-lg">
            {event.tagline}
          </p>
        </motion.div>

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.div {...rise(0.05)} className="relative mx-auto w-full max-w-md">
            <div
              className="relative overflow-hidden rounded-t-[10rem] rounded-b-3xl border"
              style={{
                borderColor: `${event.colors.accent}55`,
                boxShadow: `0 34px 74px -42px ${event.colors.glow}`,
              }}
            >
              <img
                src={event.image}
                alt={`${event.subtitle} setup`}
                loading="lazy"
                decoding="async"
                className="h-[24rem] w-full object-cover sm:h-[27rem]"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(180deg, transparent 55%, ${event.colors.accentDeep}cc 100%)`,
                }}
              />
              <span className="script absolute inset-x-0 bottom-5 text-center text-2xl text-white">
                {event.title}
              </span>
            </div>
            <span
              aria-hidden="true"
              className="anim-spin-slow absolute -left-6 -top-6 h-24 w-24 rounded-full border border-dashed"
              style={{ borderColor: `${event.colors.accent}66` }}
            />
          </motion.div>

          <motion.div {...rise(0.12)} className="flex flex-col gap-5">
            <span
              className="inline-flex w-fit items-center gap-2.5 rounded-full px-4 py-1.5 text-[0.62rem] font-medium uppercase tracking-[0.22em]"
              style={{
                backgroundColor: `${event.colors.accent}18`,
                color: event.colors.accentDeep,
                border: `1px solid ${event.colors.accent}33`,
              }}
            >
              <Icon className="h-3.5 w-3.5 opacity-80" strokeWidth={1.8} aria-hidden="true" />
              {event.timeLabel}
            </span>
            <p className="text-sm leading-relaxed text-ink-soft sm:text-base">
              {event.description}
            </p>
            <Details event={event} />
            <ColourStory event={event} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/**
 * MEHENDI — a quiet green salon: arch pattern, corner-ornamented frame and
 * a string of jasmine under the photograph.
 */
function MehendiSection({ event, index, total }: VariantProps) {
  const Icon = ICONS[event.icon];

  return (
    <section
      id={event.id}
      style={accentVars(event)}
      className="relative scroll-mt-24 overflow-hidden bg-bg"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${event.colors.accentSoft} 42%, transparent 100%)`,
        }}
      />
      <span aria-hidden="true" className="pattern-arch absolute inset-x-0 top-0 h-44" />
      <FloatingPetals
        count={10}
        duration={24}
        colors={["#f4f9f2", "#cfe3d4", "#e8dcbb"]}
        className="opacity-70"
      />

      <div className="shell section-pad relative">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div {...rise()} className="order-2 lg:order-1">
            <span
              className="eyebrow"
              style={{ color: event.colors.accentDeep }}
            >
              Function {index + 1} of {total}
            </span>
            <h2 className="section-title mt-3">{event.title}</h2>
            <p className="script mt-2 text-3xl sm:text-4xl" style={{ color: event.colors.accent }}>
              {event.subtitle}
            </p>
            <p className="mt-4 font-accent text-base italic text-ink-soft sm:text-lg">
              {event.tagline}
            </p>
            <p className="mt-5 text-sm leading-relaxed text-ink-soft sm:text-base">
              {event.description}
            </p>
            <Details event={event} className="mt-6" />
            <ColourStory event={event} className="mt-5" />
          </motion.div>

          <motion.div {...rise(0.1)} className="order-1 lg:order-2">
            <div
              className="relative rounded-[1.75rem] border p-3"
              style={{
                borderColor: `${event.colors.accent}44`,
                background: "color-mix(in srgb, var(--c-surface) 72%, transparent)",
              }}
            >
              <div className="relative overflow-hidden rounded-[1.3rem]">
                <img
                  src={event.image}
                  alt={`${event.subtitle} decor`}
                  loading="lazy"
                  decoding="async"
                  className="h-[24rem] w-full object-cover sm:h-[28rem]"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(180deg, transparent 58%, ${event.colors.accentDeep}cc 100%)`,
                  }}
                />
                <span
                  className="absolute bottom-5 left-5 inline-flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.26em] text-white"
                >
                  <Icon className="h-3.5 w-3.5" strokeWidth={1.7} aria-hidden="true" />
                  {event.timeLabel}
                </span>
              </div>

              <span className="corner-ornament corner-tl" aria-hidden="true" />
              <span className="corner-ornament corner-tr" aria-hidden="true" />
              <span className="corner-ornament corner-bl" aria-hidden="true" />
              <span className="corner-ornament corner-br" aria-hidden="true" />
            </div>

            {/* jasmine string */}
            <div
              aria-hidden="true"
              className="mt-5 flex items-center justify-center gap-2"
            >
              {Array.from({ length: 13 }, (_, dot) => (
                <span
                  key={dot}
                  className="h-2.5 w-2.5 rounded-full"
                  style={{
                    background: dot % 2 === 0 ? "#ffffff" : event.colors.accentSoft,
                    boxShadow: `0 0 8px ${event.colors.glow}`,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/**
 * SANGEET — the night section: full-bleed stage photograph behind a deep
 * purple wash, sparkles, and a light card holding the details.
 */
function SparkleSection({ event, index, total }: VariantProps) {
  const Icon = ICONS[event.icon];

  return (
    <section id={event.id} style={accentVars(event)} className="relative scroll-mt-24 overflow-hidden">
      <img
        src={event.image}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: `linear-gradient(115deg, #241038 0%, ${event.colors.accentDeep}f2 42%, ${event.colors.accent}b8 100%)`,
        }}
      />
      <SparkleField count={26} color={event.colors.accentSoft} className="opacity-80" />
      <FloatingPetals
        count={8}
        duration={22}
        colors={["#e05b8a", "#d8b25c", "#b98ade"]}
        className="opacity-50"
      />

      <div className="shell section-pad relative text-white">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div {...rise()}>
            <span className="eyebrow text-white/70">
              <span className="hairline hidden w-10 sm:block" />
              Function {index + 1} of {total}
            </span>
            <h2 className="section-title mt-3 text-white">{event.title}</h2>
            <p className="script mt-2 text-4xl text-white/90 sm:text-5xl">{event.subtitle}</p>
            <p className="mt-4 max-w-xl font-accent text-lg italic text-white/80">
              {event.tagline}
            </p>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
              {event.description}
            </p>
          </motion.div>

          <motion.div {...rise(0.12)} className="card-royal p-5 sm:p-7">
            <span
              className="mb-5 inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-[0.62rem] font-medium uppercase tracking-[0.22em]"
              style={{
                backgroundColor: `${event.colors.accent}22`,
                color: event.colors.accentDeep,
                border: `1px solid ${event.colors.accent}44`,
              }}
            >
              <Icon className="h-3.5 w-3.5 opacity-90" strokeWidth={1.8} aria-hidden="true" />
              {event.timeLabel}
            </span>
            <Details event={event} />
            <ColourStory event={event} className="mt-5" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/**
 * WEDDING — the altar: symmetrical, centred and ceremonial, with a
 * mandala-style badge and a wide mandap banner.
 */
function RoyalSection({ event, index, total }: VariantProps) {
  const Icon = ICONS[event.icon];

  return (
    <section id={event.id} style={accentVars(event)} className="relative scroll-mt-24 overflow-hidden bg-bg">
      <span aria-hidden="true" className="pattern-jaali absolute inset-0 opacity-20" />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: `radial-gradient(900px 460px at 50% -8%, ${event.colors.accentSoft} 0%, transparent 62%)`,
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${event.colors.accentDeep}14 0%, transparent 28%, transparent 72%, ${event.colors.accentDeep}14 100%)`,
        }}
      />

      {/* ornamental mandalas for the royal wedding section */}
      <span
        aria-hidden="true"
        className="anim-spin-slow absolute -left-20 -top-20 h-64 w-64 opacity-[0.07]"
        style={{
          backgroundImage: `radial-gradient(circle at center, ${event.colors.accentDeep} 0.5px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />
      <span
        aria-hidden="true"
        className="anim-spin-slow absolute -right-20 -bottom-20 h-64 w-64 opacity-[0.07]"
        style={{
          backgroundImage: `radial-gradient(circle at center, ${event.colors.accentDeep} 0.5px, transparent 1px)`,
          backgroundSize: "24px 24px",
          animationDirection: "reverse",
        }}
      />

      <div className="shell section-pad relative">
        <motion.div {...rise()} className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <span
            className="grid h-14 w-14 place-items-center rounded-full border"
            style={{
              borderColor: `${event.colors.accent}66`,
              background: "color-mix(in srgb, var(--c-surface) 80%, transparent)",
            }}
          >
            <Icon
              className="h-6 w-6"
              strokeWidth={1.4}
              style={{ color: event.colors.accentDeep }}
              aria-hidden="true"
            />
          </span>
          <FunctionLabel event={event} index={index} total={total} className="mt-5" />
          <h2 className="section-title gold-text mt-3">{event.title}</h2>
          <p className="script mt-2 text-4xl" style={{ color: event.colors.accentDeep }}>
            {event.subtitle}
          </p>
          <p className="mt-3 font-accent text-lg italic text-ink-soft">{event.tagline}</p>
        </motion.div>

        <motion.div {...rise(0.1)} className="relative mx-auto mt-10 max-w-5xl">
          <div
            className="relative overflow-hidden rounded-[2rem] border-4"
            style={{ borderColor: `${event.colors.accent}55` }}
          >
            <img
              src={event.image}
              alt={`${event.subtitle} mandap`}
              loading="lazy"
              decoding="async"
              className="h-[19rem] w-full object-cover sm:h-[26rem]"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, transparent 45%, ${event.colors.accentDeep}cc 100%)`,
              }}
            />
            <p className="absolute inset-x-0 bottom-6 px-6 text-center font-accent text-sm uppercase tracking-[0.34em] text-white sm:text-base">
              {event.dateLabel}
            </p>

            <span className="corner-ornament corner-tl" aria-hidden="true" />
            <span className="corner-ornament corner-tr" aria-hidden="true" />
            <span className="corner-ornament corner-bl" aria-hidden="true" />
            <span className="corner-ornament corner-br" aria-hidden="true" />
          </div>
        </motion.div>

        <div className="mx-auto mt-10 grid max-w-5xl gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <motion.p
            {...rise(0.15)}
            className="text-sm leading-relaxed text-ink-soft sm:text-base"
          >
            {event.description}
          </motion.p>
          <motion.div {...rise(0.2)} className="flex flex-col gap-4">
            <Details event={event} />
            <ColourStory event={event} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/**
 * One wedding function, as its own dedicated section with a layout built
 * around that function's theme. Every section carries its own id, which is
 * also the cue the background music follows.
 */
export function EventShowcase({ event, index, total }: VariantProps) {
  const decor: EventDecor = event.decor;
  const props = { event, index, total };

  if (decor === "marigold") return <MarigoldSection {...props} />;
  if (decor === "mehendi") return <MehendiSection {...props} />;
  if (decor === "sparkle") return <SparkleSection {...props} />;
  return <RoyalSection {...props} />;
}

export default EventShowcase;
