import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { weddingConfig, type GalleryImage } from "../config/weddingConfig";
import { cn } from "../utils/cn";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const SHAPE_CLASS: Record<GalleryImage["shape"], string> = {
  portrait: "aspect-4/5",
  square: "aspect-square",
  landscape: "aspect-16/10",
};

/**
 * Masonry-style gallery with a full-screen lightbox.
 * Images are lazy loaded, so only what is near the viewport is fetched.
 */
export function PhotoGallery() {
  const images = weddingConfig.gallery;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isOpen = activeIndex !== null;

  const close = useCallback(() => setActiveIndex(null), []);
  const showNext = useCallback(
    () => setActiveIndex((index) => (index === null ? index : (index + 1) % images.length)),
    [images.length],
  );
  const showPrev = useCallback(
    () =>
      setActiveIndex((index) =>
        index === null ? index : (index - 1 + images.length) % images.length,
      ),
    [images.length],
  );

  // Keyboard controls + scroll lock while the lightbox is open.
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") showNext();
      if (event.key === "ArrowLeft") showPrev();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, close, showNext, showPrev]);

  const activeImage = activeIndex === null ? null : images[activeIndex];

  return (
    <section id="gallery" className="section-pad relative overflow-hidden bg-bg">
      <div className="shell">
        <SectionHeading
          eyebrow="Moments"
          title="Couple Photo Gallery"
          subtitle="A few frames from the years that led here. Tap any photo to open it full screen."
        />

        <div className="mt-14 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {images.map((image, index) => (
            <Reveal
              key={image.src}
              delay={(index % 3) * 0.06}
              className="mb-4 break-inside-avoid"
            >
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                className="group relative block w-full overflow-hidden rounded-3xl border border-line bg-bg-alt"
                aria-label={`Open image ${index + 1} of ${images.length}: ${image.alt}`}
              >
                <span className={cn("block w-full", SHAPE_CLASS[image.shape])}>
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition duration-[1.3s] group-hover:scale-[1.06]"
                  />
                </span>
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/0 to-black/0 opacity-0 transition duration-500 group-hover:opacity-100" />
                <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-4 opacity-0 transition duration-500 group-hover:opacity-100">
                  <span className="text-left text-[0.72rem] font-medium text-white">
                    {image.alt}
                  </span>
                  <Maximize2 className="h-4 w-4 shrink-0 text-white/85" />
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && activeImage && (
          <motion.div
            key="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
            className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-black/88 px-4 py-6 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={close}
          >
            <button
              type="button"
              onClick={close}
              className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-white/10 text-white transition hover:bg-white/20"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close photo viewer</span>
            </button>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showPrev();
              }}
              className="absolute left-3 grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-white/10 text-white transition hover:bg-white/20 sm:left-6"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Previous photo</span>
            </button>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showNext();
              }}
              className="absolute right-3 grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-white/10 text-white transition hover:bg-white/20 sm:right-6"
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Next photo</span>
            </button>

            <AnimatePresence mode="wait" initial={false}>
              <motion.figure
                key={activeImage.src}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="flex max-h-full w-full max-w-4xl flex-col items-center gap-4"
                onClick={(event) => event.stopPropagation()}
              >
                <img
                  src={activeImage.src}
                  alt={activeImage.alt}
                  className="max-h-[72vh] w-auto rounded-2xl border border-white/15 object-contain"
                />
                <figcaption className="text-center">
                  <span className="block text-sm text-white/90">{activeImage.alt}</span>
                  <span className="mt-1 block text-[0.68rem] uppercase tracking-[0.28em] text-white/55">
                    {(activeIndex ?? 0) + 1} / {images.length}
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default PhotoGallery;
