"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// Autoplaying, muted, looping background video for the hero — falls back to
// the static poster image when no video is configured yet, for
// prefers-reduced-motion visitors, and on small screens (to avoid burning
// mobile data on a decorative background clip).
export function HeroVideo({
  src,
  poster,
  alt,
}: {
  src?: string;
  poster: string;
  alt: string;
}) {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    if (!src) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isSmallScreen = window.matchMedia("(max-width: 767px)").matches;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowVideo(!prefersReducedMotion && !isSmallScreen);
  }, [src]);

  if (showVideo && src) {
    return (
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={poster}
        aria-label={alt}
        className="h-full w-full object-cover"
      >
        <source src={src} />
      </video>
    );
  }

  return <Image src={poster} alt={alt} fill priority sizes="(max-width: 768px) 100vw, 40vw" className="object-cover" />;
}
