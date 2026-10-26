import { useMemo } from "react";
import { usePrefersReducedMotion } from "../hooks/useScrollReveal";
import { cn } from "../utils/cn";

interface SparkleFieldProps {
  count?: number;
  color?: string;
  className?: string;
}

function pseudoRandom(seed: number, salt: number): number {
  const value = Math.sin(seed * 47.13 + salt * 91.7) * 13758.5453;
  return value - Math.floor(value);
}

/** Twinkling lights — used by the Sangeet card and the closing section. */
export function SparkleField({
  count = 16,
  color = "#d8b25c",
  className,
}: SparkleFieldProps) {
  const reducedMotion = usePrefersReducedMotion();

  const sparkles = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        id: index,
        left: pseudoRandom(index, 1) * 98,
        top: pseudoRandom(index, 2) * 92,
        size: 2 + pseudoRandom(index, 3) * 3.5,
        delay: pseudoRandom(index, 4) * 4,
        duration: 2.2 + pseudoRandom(index, 5) * 3,
      })),
    [count],
  );

  if (reducedMotion) return null;

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {sparkles.map((sparkle) => (
        <span
          key={sparkle.id}
          className="anim-twinkle absolute rounded-full"
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            background: color,
            boxShadow: `0 0 ${sparkle.size * 3}px ${color}`,
            animationDelay: `${sparkle.delay}s`,
            animationDuration: `${sparkle.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export default SparkleField;
