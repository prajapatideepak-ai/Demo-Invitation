import { ArrowUp, Heart } from "lucide-react";
import { weddingConfig } from "../config/weddingConfig";
import { scrollToSection } from "../utils/scroll";
import SparkleField from "./SparkleField";

/**
 * Closing thank-you section + footer.
 */
export function Footer() {
  const {
    partnerOne,
    partnerTwo,
    closingTitle,
    closingMessage,
    signature,
    hashtag,
    dateLabel,
  } = weddingConfig;

  return (
    <footer
      id="thanks"
      className="relative overflow-hidden bg-primary-dark text-white"
    >
      <div
        aria-hidden="true"
        className="pattern-jaali pointer-events-none absolute inset-0 opacity-15"
      />
      <SparkleField count={20} color="#e3c88b" className="opacity-60" />

      <div className="shell relative flex flex-col items-center gap-6 py-20 text-center sm:py-24">
        <span className="grid h-12 w-12 place-items-center rounded-full border border-white/25">
          <Heart className="h-5 w-5 text-accent" strokeWidth={1.6} />
        </span>

        <h2 className="script gold-text text-4xl sm:text-5xl">{closingTitle}</h2>

        <p className="max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
          {closingMessage}
        </p>

        <div className="flex w-full max-w-sm items-center gap-3" aria-hidden="true">
          <span className="h-px flex-1 bg-white/25" />
          <Heart className="h-3 w-3 text-white/60" strokeWidth={1.5} />
          <span className="h-px flex-1 bg-white/25" />
        </div>

        <p className="script text-3xl text-white/95 sm:text-4xl">{signature}</p>
        <p className="eyebrow text-white/70">{hashtag}</p>

        <button
          type="button"
          onClick={() => scrollToSection("home")}
          className="btn btn-outline border-white/30 bg-transparent text-white/90 hover:text-white"
        >
          Back to top
          <ArrowUp className="h-3.5 w-3.5" />
        </button>

        <div className="mt-8 flex w-full max-w-2xl flex-col items-center gap-1.5 border-t border-white/15 pt-6 text-[0.66rem] tracking-wide text-white/55">
          <p>
            {partnerOne} &amp; {partnerTwo} · {dateLabel}
          </p>
          <p>
            A front-end invitation built with React, Vite, Tailwind CSS and Framer Motion. No
            backend, no tracking, no data leaves your browser.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
