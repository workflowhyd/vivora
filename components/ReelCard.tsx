"use client";

import { useState } from "react";
import { Play } from "lucide-react";

// A portrait video tile that shows a static thumbnail until hovered (or
// tapped, for touch devices without hover), then swaps in a muted,
// autoplaying, looping embed — the iframe is only mounted while active, so
// nothing plays or downloads until then.
export function ReelCard({ youtubeId, caption }: { youtubeId: string; caption?: string }) {
  const [active, setActive] = useState(false);

  return (
    <button
      type="button"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onClick={() => setActive((a) => !a)}
      aria-label={active ? "Pause reel" : "Play reel"}
      className="group relative aspect-[9/16] w-full overflow-hidden rounded-md bg-blue-dark text-left"
    >
      {active ? (
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&modestbranding=1&playsinline=1`}
          title={caption ?? "Reel"}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        />
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
            alt={caption ?? ""}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-blue-dark/25 transition-colors duration-300 group-hover:bg-blue-dark/10">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cream-light/90 text-green">
              <Play size={20} className="ml-0.5" />
            </span>
          </div>
        </>
      )}
      {caption && (
        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-blue-dark/80 to-transparent px-3 pb-2.5 pt-6 text-sm text-cream-light">
          {caption}
        </span>
      )}
    </button>
  );
}
