import { Diamond } from "lucide-react";
import { cn } from "../utils/cn";
import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
  /** Renders the title in the gold gradient treatment. */
  goldTitle?: boolean;
}

/** Small ornamental rule: line — diamond — line. */
export function OrnamentDivider({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)} aria-hidden="true">
      <span className="hairline" />
      <Diamond className="h-3 w-3 shrink-0 text-accent" strokeWidth={1.5} />
      <span className="hairline" />
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
  goldTitle = false,
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <Reveal
      className={cn(
        "flex flex-col gap-4",
        isCenter ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      <span className="eyebrow">
        {isCenter && <span className="hairline hidden w-10 sm:block" />}
        {eyebrow}
        <span className={cn("hairline w-10", !isCenter && "hidden")} />
      </span>

      <h2 className={cn("section-title max-w-3xl", goldTitle && "gold-text")}>{title}</h2>

      <OrnamentDivider className={cn("w-full max-w-xs", !isCenter && "max-w-[10rem]")} />

      {subtitle && (
        <p className="max-w-2xl text-sm leading-relaxed text-ink-soft sm:text-base">{subtitle}</p>
      )}
    </Reveal>
  );
}

export default SectionHeading;
