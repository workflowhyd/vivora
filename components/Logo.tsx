import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The approved Vivora Foods logo, with its background keyed out to
 * transparent. Shown on a warm cream tile (matching the site's --color-cream-light
 * token, not an arbitrary off-white) so it stays legible on the green
 * header/footer and on light sections alike, on both desktop and mobile.
 * Size it via `className` (height drives the width).
 */
export function Logo({
  className,
}: {
  /** Kept for call-site compatibility; the artwork is identical on any background. */
  variant?: "light" | "dark";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative aspect-[1026/1140] h-16 md:h-20 shrink-0 select-none overflow-hidden rounded-xl bg-cream-light shadow-[0_2px_12px_-4px_rgba(0,0,0,0.35)] transition-all duration-500",
        className
      )}
    >
      <Image
        src="/images/vivora-logo.webp"
        alt="Vivora Foods — Dry Delicious"
        fill
        priority
        sizes="(min-width: 768px) 80px, 64px"
        className="object-contain object-center"
      />
    </div>
  );
}
