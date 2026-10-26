import { CalendarDays, Car, Clock, ExternalLink, MapPin, Phone } from "lucide-react";
import { weddingConfig } from "../config/weddingConfig";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3.5">
      <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-bg-alt text-accent">
        <Icon className="h-4 w-4" strokeWidth={1.6} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-[0.58rem] uppercase tracking-[0.26em] text-ink-soft">{label}</p>
        <p className="text-sm leading-relaxed text-ink">{value}</p>
      </div>
    </div>
  );
}

/**
 * Venue details with a key-less Google Maps embed.
 * The embed URL is stored in the local configuration file, so no API key
 * (and no private credential) is ever exposed in the bundle.
 */
export function VenueSection() {
  const { venue } = weddingConfig;

  return (
    <section id="venue" className="section-pad relative overflow-hidden bg-bg-alt">
      <div
        aria-hidden="true"
        className="pattern-jaali pointer-events-none absolute inset-0 opacity-10"
      />

      <div className="shell relative">
        <SectionHeading
          eyebrow="Find Us"
          title="Venue & Location"
          subtitle={`${venue.name} — ${venue.hall}. Everything happens under one roof, so you can stay for the whole celebration.`}
          goldTitle
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.05fr] lg:gap-8">
          <Reveal className="h-full">
            <div className="card-royal flex h-full flex-col gap-6 p-6 sm:p-8">
              <div>
                <p className="eyebrow">The Venue</p>
                <h3 className="mt-2 font-display text-2xl text-primary sm:text-3xl">
                  {venue.name}
                </h3>
                <p className="mt-1 font-accent text-base italic text-ink-soft">
                  {venue.hall}
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <InfoRow icon={MapPin} label="Address" value={venue.address} />
                <InfoRow icon={CalendarDays} label="Date" value={venue.dateLabel} />
                <InfoRow icon={Clock} label="Schedule" value={venue.timeLabel} />
                <InfoRow icon={Car} label="Parking" value={venue.parking} />
                <InfoRow
                  icon={Phone}
                  label="Family contact"
                  value={`${venue.contactName} · ${venue.contactPhone}`}
                />
              </div>

              <div className="mt-auto flex flex-wrap gap-3 pt-2">
                <a
                  className="btn btn-solid"
                  href={venue.directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Get Directions
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <a className="btn btn-outline" href={`tel:${venue.contactPhone.replace(/\s/g, "")}`}>
                  Call the family
                  <Phone className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12} className="h-full">
            <div className="relative h-[320px] overflow-hidden rounded-[1.75rem] border border-line sm:h-[400px] lg:h-full lg:min-h-[460px]">
              <iframe
                title={`Map showing the location of ${venue.name}`}
                src={venue.mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full"
                style={{ border: 0 }}
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default VenueSection;
