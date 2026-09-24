"use client";

import { useRef, useState } from "react";
import { Play } from "lucide-react";

// A portrait video tile that only plays on hover (or tap, for touch
// devices without hover) — otherwise it shows a static thumbnail, so
// nothing plays or downloads until requested. Handles both a YouTube link
// (iframe, only mounted while active) and an uploaded file (a real <video>,
// played/paused directly — no remount needed).
export function ReelCard({
  youtubeId,
  fileSrc,
  caption,
}: {
  youtubeId?: string;
  fileSrc?: string;
  caption?: string;
}) {
  const [active, setActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const start = () => {
    setActive(true);
    videoRef.current?.play().catch(() => {});
  };
  const stop = () => {
    setActive(false);
    const el = videoRef.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
  };

  return (
    <button
      type="button"
      onMouseEnter={start}
      onMouseLeave={stop}
      onClick={() => (active ? stop() : start())}
      aria-label={active ? "Pause reel" : "Play reel"}
      className="group relative aspect-[9/16] w-full overflow-hidden rounded-md bg-blue-dark text-left"
    >
      {fileSrc ? (
        <video
          ref={videoRef}
          src={fileSrc}
          muted
          loop
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
        />
      ) : active && youtubeId ? (
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&modestbranding=1&playsinline=1`}
          title={caption ?? "Reel"}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        />
      ) : youtubeId ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
          alt={caption ?? ""}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : null}

      {!active && (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-dark/25 transition-colors duration-300 group-hover:bg-blue-dark/10">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cream-light/90 text-green">
            <Play size={20} className="ml-0.5" />
          </span>
        </div>
      )}

      {caption && (
        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-blue-dark/80 to-transparent px-3 pb-2.5 pt-6 text-sm text-cream-light">
          {caption}
        </span>
      )}
    </button>
  );
}
