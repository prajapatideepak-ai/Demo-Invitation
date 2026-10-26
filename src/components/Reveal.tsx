import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";

interface RevealProps {
  children: ReactNode;
  /** Seconds to wait before this element animates in. */
  delay?: number;
  /** Distance travelled while fading in. */
  y?: number;
  x?: number;
  className?: string;
  once?: boolean;
}

/**
 * Scroll-triggered reveal wrapper.
 * Content is only animated when it enters the viewport, and the whole
 * transform is skipped for guests who prefer reduced motion (handled both
 * here and by <MotionConfig reducedMotion="user"> at the app root).
 */
export function Reveal({
  children,
  delay = 0,
  y = 30,
  x = 0,
  className,
  once = true,
}: RevealProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ once });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y, x }}
      animate={isVisible ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y, x }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default Reveal;
