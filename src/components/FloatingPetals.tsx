import { useMemo } from "react";
import { usePrefersReducedMotion } from "../hooks/useScrollReveal";
import { cn } from "../utils/cn";
import type { CSSProperties } from "react";

interface FloatingPetalsProps {
  /** How many petals drift across the section. Keep it low for performance. */
  count?: number;
  colors?: string[];
  className?: string;
  /** Duration of a full fall, in seconds. */
  duration?: number;
}

interface Petal {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  rotation: number;
  color: string;
}

/** Deterministic pseudo random so re-renders never reshuffle the petals. */
function pseudoRandom(seed: number, salt: number): number {
  const value = Math.sin(seed * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

export function FloatingPetals({
  count = 14,
  colors = ["#f0b429", "#e07a1f", "#f2c14e", "#d96b2b"],
  className,
  duration = 16,
}: FloatingPetalsProps) {
  const reducedMotion = usePrefersReducedMotion();

  const petals = useMemo<Petal[]>(
    () =>
      Array.from({ length: count }, (_, index) => ({
        id: index,
        left: pseudoRandom(index, 1) * 96,
        size: 7 + pseudoRandom(index, 2) * 11,
        duration: duration + pseudoRandom(index, 3) * duration * 0.8,
        delay: pseudoRandom(index, 4) * duration,
        drift: (pseudoRandom(index, 5) - 0.5) * 22,
        rotation: 160 + pseudoRandom(index, 6) * 320,
        color: colors[index % colors.length],
      })),
    [count, colors, duration],
  );

  // Decorative only, and skipped entirely for reduced-motion visitors.
  if (reducedMotion) return null;

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {petals.map((petal) => {
        const style: CSSProperties = {
          left: `${petal.left}%`,
          width: `${petal.size}px`,
          height: `${petal.size * 1.35}px`,
          animationDuration: `${petal.duration}s`,
          animationDelay: `-${petal.delay}s`,
          opacity: 0,
        };
        // Custom properties consumed by the `drift` keyframes in globals.css
        (style as Record<string, string | number>)["--drift-x"] = `${petal.drift}vw`;
        (style as Record<string, string | number>)["--drift-rot"] = `${petal.rotation}deg`;
        (style as Record<string, string | number>)["--petal-color"] = petal.color;

        return <span key={petal.id} className="petal anim-drift" style={style} />;
      })}
    </div>
  );
}

export default FloatingPetals;
