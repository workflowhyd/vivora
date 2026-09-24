"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

// A full-bleed, centered background video for the hero — muted/looped
// autoplay (the only way browsers allow it), paused whenever it scrolls out
// of view, and never played at all for a visitor who prefers reduced motion
// (the poster frame, or the video's first frame, shows instead).
export function HeroBackgroundVideo({ video, poster }: { video: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <video
      ref={ref}
      src={video}
      poster={poster}
      muted
      loop
      playsInline
      autoPlay={!reducedMotion}
      preload="metadata"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full object-cover object-center"
    />
  );
}
