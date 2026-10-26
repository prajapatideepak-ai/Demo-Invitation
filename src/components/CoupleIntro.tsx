import { CalendarDays, Heart, MapPin, Quote } from "lucide-react";
import { weddingConfig } from "../config/weddingConfig";
import { Reveal } from "./Reveal";
import SectionHeading from "./SectionHeading";

/**
 * Couple introduction — sits between the hero and the countdown.
 * All copy comes from the local configuration file.
 */
export function CoupleIntro() {
  const {
    partnerOne,
    partnerTwo,
    partnerOneRole,
    partnerTwoRole,
    partnerOneImage,
    partnerTwoImage,
    coupleStory,
    hashtag,
    dateLabel,
    city,
  } = weddingConfig;

  const partners = [
    { name: partnerOne, role: partnerOneRole, image: partnerOneImage },
    { name: partnerTwo, role: partnerTwoRole, image: partnerTwoImage },
  ];

  const chips = [
    { icon: CalendarDays, text: dateLabel },
    { icon: MapPin, text: city },
    { icon: Heart, text: hashtag },
  ];

  return (
    <section id="couple" className="section-pad relative overflow-hidden bg-bg">
      <div
        aria-hidden="true"
        className="pattern-jaali pointer-events-none absolute inset-x-0 top-0 h-40 opacity-15"
      />

      <div className="shell flex flex-col items-center gap-12">
        <SectionHeading
          eyebrow="The Couple"
          title={`${partnerOne} & ${partnerTwo}`}
          goldTitle
        />

        <Reveal className="max-w-3xl">
          <p className="flex gap-3 text-center font-accent text-lg leading-relaxed text-ink-soft italic sm:text-xl">
            <Quote className="mt-1 h-5 w-5 shrink-0 text-accent" strokeWidth={1.5} />
            <span>{coupleStory}</span>
          </p>
        </Reveal>

        <div className="grid w-full max-w-4xl items-stretch gap-6 sm:grid-cols-2 sm:gap-8">
          {partners.map((partner, index) => (
            <Reveal key={partner.name} delay={index * 0.12} className="h-full">
              <article className="card-royal group h-full overflow-hidden">
                <div className="relative aspect-4/5 overflow-hidden">
                  <img
                    src={partner.image}
                    alt={`Portrait of ${partner.name}`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition duration-[1.4s] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-center">
                    <h3 className="script text-4xl text-white sm:text-5xl">
                      {partner.name}
                    </h3>
                  </div>
                </div>
                <p className="px-5 py-4 text-center text-[0.72rem] uppercase tracking-[0.22em] text-ink-soft">
                  {partner.role}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="flex flex-wrap items-center justify-center gap-3">
          {chips.map(({ icon: Icon, text }) => (
            <span
              key={text}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-4 py-2 text-[0.7rem] uppercase tracking-[0.2em] text-ink-soft"
            >
              <Icon className="h-3.5 w-3.5 text-accent" strokeWidth={1.6} />
              {text}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export default CoupleIntro;
