import { useEffect, useRef } from "react";
import { useAudio, type AudioTrack } from "../context/AudioContext";

export interface MusicSection {
  id: string;
  track: AudioTrack;
}

/**
 * Plays the background track that belongs to the section currently in view.
 *
 * A narrow band across the middle of the viewport marks the "active"
 * section, so only one section is ever active while scrolling. When it
 * changes, the shared controller swaps to the new section's track — the
 * previous song is stopped by the controller itself, so overlapping audio
 * is impossible.
 */
export function useSectionMusic(sections: MusicSection[], enabled: boolean): void {
  const { playTrack } = useAudio();
  const activeIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === "undefined") return;

    const inBand = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) inBand.add(entry.target.id);
          else inBand.delete(entry.target.id);
        });

        // If two sections share the band, the later one in page order wins.
        const next = sections.reduce<string | null>(
          (current, section) => (inBand.has(section.id) ? section.id : current),
          null,
        );

        if (!next || next === activeIdRef.current) return;

        const section = sections.find((item) => item.id === next);
        if (!section) return;

        activeIdRef.current = next;
        playTrack(section.track);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections, enabled, playTrack]);
}

export default useSectionMusic;
