import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";

/**
 * Centralised background-music controller
 * ------------------------------------------------------------------
 * Exactly one <audio> element exists for the whole invitation, created
 * lazily with `preload="none"`. Every section asks this controller for its
 * track, so moving between sections swaps the source of that single element
 * — the previous song stops immediately and two clips can never overlap.
 *
 * There is deliberately no player UI: the music is background only.
 */

export interface AudioTrack {
  id: string;
  src: string;
  title: string;
  artist?: string;
}

/** Background music sits under the page, so it plays softly by default. */
const DEFAULT_VOLUME = 0.4;

/** The first interaction with the page also unblocks audio playback. */
const UNLOCK_EVENTS: Array<keyof WindowEventMap> = [
  "pointerdown",
  "keydown",
  "touchstart",
  "wheel",
  "scroll",
];

interface AudioContextValue {
  /** Start, or switch to, a track. Safe to call repeatedly. */
  playTrack: (track: AudioTrack) => void;
}

const AudioContext = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  /** The track that should be playing, even if a browser policy is holding it back. */
  const trackRef = useRef<AudioTrack | null>(null);
  const unlockedRef = useRef(false);
  const brokenRef = useRef(false);

  /** Lazily create the shared element and wire its events (once). */
  useEffect(() => {
    const el = new Audio();
    el.preload = "none";
    el.volume = DEFAULT_VOLUME;
    // A section's music plays until another section takes over.
    el.loop = true;
    audioRef.current = el;

    const handlePlaying = () => {
      unlockedRef.current = true;
    };
    const handleError = () => {
      brokenRef.current = true;
      console.warn(
        `[music] Could not play "${trackRef.current?.src ?? "the track"}". Add the file to public/audio.`,
      );
    };

    el.addEventListener("playing", handlePlaying);
    el.addEventListener("error", handleError);

    return () => {
      el.removeEventListener("playing", handlePlaying);
      el.removeEventListener("error", handleError);
      el.pause();
      el.removeAttribute("src");
      el.load();
      audioRef.current = null;
      trackRef.current = null;
    };
  }, []);

  /** Start the pending track; a blocked attempt simply waits for a gesture. */
  const attemptPlay = useCallback(() => {
    const el = audioRef.current;
    if (!el || !trackRef.current || brokenRef.current) return;

    const attempt = el.play();
    // Older Safari returns undefined instead of a promise.
    if (attempt && typeof attempt.catch === "function") {
      attempt.catch((error: DOMException) => {
        if (error?.name === "NotAllowedError") return; // autoplay policy — retried below
        brokenRef.current = true;
        console.warn(
          `[music] Could not play "${trackRef.current?.src ?? "the track"}". Add the file to public/audio.`,
        );
      });
    }
  }, []);

  const playTrack = useCallback(
    (track: AudioTrack) => {
      const el = audioRef.current;
      if (!el) return;
      if (trackRef.current?.id === track.id && !el.paused) return;

      // Switching sections: swapping the source stops the previous song.
      if (trackRef.current?.id !== track.id) {
        brokenRef.current = false;
        trackRef.current = track;
        el.src = track.src;
      }

      attemptPlay();
    },
    [attemptPlay],
  );

  /**
   * Autoplay fallback. Until the guest interacts with the page the browser
   * refuses to start audio, so the pending track is retried on the first
   * tap, click or key press — and again whenever the tab regains focus.
   * Nothing is shown to the guest; the controls stay hidden.
   */
  useEffect(() => {
    const retry = () => {
      if (!unlockedRef.current) attemptPlay();
    };
    const handleVisibility = () => {
      const el = audioRef.current;
      if (document.visibilityState === "visible" && el?.paused) attemptPlay();
    };

    UNLOCK_EVENTS.forEach((event) =>
      window.addEventListener(event, retry, { passive: true }),
    );
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      UNLOCK_EVENTS.forEach((event) => window.removeEventListener(event, retry));
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [attemptPlay]);

  const value = useMemo<AudioContextValue>(() => ({ playTrack }), [playTrack]);

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}

export function useAudio(): AudioContextValue {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used inside an <AudioProvider>.");
  }
  return context;
}
