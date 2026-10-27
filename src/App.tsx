import { MotionConfig } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import Countdown from "./components/Countdown";
import CoupleIntro from "./components/CoupleIntro";
import EventShowcase from "./components/EventShowcase";
import Footer from "./components/Footer";
import LoveStory from "./components/LoveStory";
import Navbar from "./components/Navbar";
import PhotoGallery from "./components/PhotoGallery";
import SectionHeading from "./components/SectionHeading";
import VenueSection from "./components/VenueSection";
import WelcomeSection from "./components/WelcomeSection";
import { musicSections } from "./config/musicConfig";
import { applyTheme } from "./config/themes";
import { weddingConfig } from "./config/weddingConfig";
import { weddingEvents } from "./config/weddingEvents";
import { AudioProvider } from "./context/AudioContext";
import { useSectionMusic } from "./hooks/useSectionMusic";
import { scrollToSection } from "./utils/scroll";

/**
 * Wedding functions — one dedicated section per ceremony, each with its
 * own layout, palette and background track. They all live inside this
 * single "celebrations" band of the page.
 */
function EventsSection() {
  return (
    <section id="events" className="relative overflow-hidden bg-bg pt-16 sm:pt-20">
      <span
        aria-hidden="true"
        className="pattern-jaali pointer-events-none absolute inset-x-0 top-0 h-60 opacity-10"
      />

      <div className="shell relative flex flex-col items-center gap-10">
        <SectionHeading
          eyebrow="The Celebrations"
          title="Wedding Functions"
          subtitle="Four celebrations, four moods, one family. Scroll through — each function has its own music."
          goldTitle
        />

        <ul className="flex flex-wrap justify-center gap-2">
          {weddingEvents.map((event) => (
            <li key={event.id}>
              <button
                type="button"
                onClick={() => scrollToSection(event.id)}
                className="rounded-full border border-line bg-surface/70 px-4 py-2 text-[0.64rem] font-medium uppercase tracking-[0.2em] text-ink-soft transition hover:border-accent hover:text-accent"
              >
                {event.title}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12">
        {weddingEvents.map((event, index) => (
          <EventShowcase
            key={event.id}
            event={event}
            index={index}
            total={weddingEvents.length}
          />
        ))}
      </div>
    </section>
  );
}

/**
 * Single-page wedding invitation.
 * Every "section" is rendered here — there is no router and no separate
 * page; navigation links simply scroll to the matching section id, and the
 * section that scrolls into view takes over the background music.
 */
function Invitation() {
  const [invitationOpened, setInvitationOpened] = useState(false);

  // Apply the palette from the local configuration file.
  useEffect(() => {
    applyTheme(weddingConfig.theme);
  }, []);

  // Keep the page still while the invitation cover is closed.
  useEffect(() => {
    document.body.style.overflow = invitationOpened ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [invitationOpened]);

  // The visible section owns the music. Nothing starts before the guest
  // opens the invitation, which is also the gesture that unblocks audio.
  useSectionMusic(musicSections, invitationOpened);

  const handleOpenInvitation = useCallback(() => {
    setInvitationOpened(true);
    // Let the cover finish lifting before travelling down the page.
    window.setTimeout(() => scrollToSection("countdown"), 700);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen bg-bg">
        <a
          href="#events"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:border focus:border-line focus:bg-surface focus:px-4 focus:py-2 focus:text-[0.68rem] focus:uppercase focus:tracking-[0.2em]"
        >
          Skip to content
        </a>

        <Navbar visible={invitationOpened} />

        <main>
          <WelcomeSection opened={invitationOpened} onOpen={handleOpenInvitation} />
          <CoupleIntro />
          <Countdown />
          <EventsSection />
          <LoveStory />
          <PhotoGallery />
          <VenueSection />
        </main>

        <Footer />
      </div>
    </MotionConfig>
  );
}

export default function App() {
  return (
    <AudioProvider>
      <Invitation />
    </AudioProvider>
  );
}
