import { Camera, Crown, Gem, Heart, Sparkles, type LucideIcon } from "lucide-react";
import type { StoryMilestone } from "../config/weddingConfig";
import { weddingConfig } from "../config/weddingConfig";
import { cn } from "../utils/cn";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const ICONS: Record<StoryMilestone["icon"], LucideIcon> = {
  sparkles: Sparkles,
  camera: Camera,
  heart: Heart,
  gem: Gem,
  crown: Crown,
};

function Milestone({
  milestone,
  index,
}: {
  milestone: StoryMilestone;
  index: number;
}) {
  const Icon = ICONS[milestone.icon];
  const isLeft = index % 2 === 0;

  return (
    <li
      className={cn(
        "relative w-full pb-14 pl-14 md:w-1/2 md:pb-20 md:pl-0",
        isLeft ? "md:pr-14 md:text-right" : "md:ml-auto md:pl-14",
      )}
    >
      {/* Node sitting on the timeline */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-4 top-1 grid h-9 w-9 -translate-x-1/2 place-items-center rounded-full border border-line bg-surface text-accent shadow-[0_10px_30px_-18px_rgba(0,0,0,0.6)]",
          isLeft ? "md:left-auto md:right-0 md:translate-x-1/2" : "md:left-0 md:-translate-x-1/2",
        )}
      >
        <Icon className="h-4 w-4" strokeWidth={1.7} />
      </span>

      <Reveal x={isLeft ? -34 : 34} y={0} delay={0.04}>
        <article className="card-royal overflow-hidden">
          {milestone.image && (
            <div className="relative h-44 overflow-hidden sm:h-52">
              <img
                src={milestone.image}
                alt={milestone.title}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          )}

          <div className="flex flex-col gap-2 p-6">
            <span className="eyebrow">{milestone.date}</span>
            <h3 className="section-title text-2xl sm:text-3xl">{milestone.title}</h3>
            <p className="text-[0.85rem] leading-relaxed text-ink-soft">
              {milestone.description}
            </p>
          </div>
        </article>
      </Reveal>
    </li>
  );
}

/**
 * Love story timeline. Vertical on mobile, alternating around a centre
 * spine on desktop. Each milestone reveals as it scrolls into view.
 */
export function LoveStory() {
  return (
    <section id="story" className="section-pad relative overflow-hidden bg-bg-alt">
      <div
        aria-hidden="true"
        className="pattern-jaali pointer-events-none absolute inset-0 opacity-10"
      />

      <div className="shell relative">
        <SectionHeading
          eyebrow="Our Journey"
          title="Love Story"
          subtitle="Seven years, three cities and one very persistent question — here is how we got here."
          goldTitle
        />

        <ol className="relative mt-16 flex flex-col md:mt-20">
          <span
            aria-hidden="true"
            className="absolute left-4 top-2 h-[calc(100%-1rem)] w-px bg-line md:left-1/2 md:-translate-x-1/2"
          />
          {weddingConfig.story.map((milestone, index) => (
            <Milestone key={milestone.id} milestone={milestone} index={index} />
          ))}
        </ol>
      </div>
    </section>
  );
}

export default LoveStory;
