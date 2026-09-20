"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";

// Banner under the home hero. Plays the admin-uploaded video muted and looped
// (the only way browsers allow autoplay), pausing when scrolled out of view or
// when the visitor prefers reduced motion. The image slot doubles as the
// poster and as the fallback when there is no video.
export function HeroBanner({ video, image }: { video?: string; image?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const reducedMotion = useReducedMotion();

  // Play only while on screen; a manual pause sticks until the visitor resumes.
  const manuallyPaused = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !video || reducedMotion) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !manuallyPaused.current) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [video, reducedMotion]);

  if (!video && !image) return null;

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      manuallyPaused.current = false;
      el.play().catch(() => {});
    } else {
      manuallyPaused.current = true;
      el.pause();
    }
  };

  return (
    <div className="mx-auto max-w-[1440px] px-6 md:px-10 mt-12 md:mt-16">
      <div className="relative overflow-hidden rounded-[2px] bg-blue-dark">
        {video ? (
          <>
            <video
              ref={ref}
              src={video}
              poster={image}
              muted={muted}
              loop
              playsInline
              preload="metadata"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              className="w-full max-h-[70vh] object-cover"
            />
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <button
                type="button"
                onClick={toggle}
                aria-label={playing ? "Pause video" : "Play video"}
                className="h-10 w-10 rounded-full bg-blue-dark/70 text-cream-light backdrop-blur flex items-center justify-center hover:bg-blue-dark transition-colors duration-200"
              >
                {playing ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <button
                type="button"
                onClick={() => setMuted((m) => !m)}
                aria-label={muted ? "Unmute video" : "Mute video"}
                className="h-10 w-10 rounded-full bg-blue-dark/70 text-cream-light backdrop-blur flex items-center justify-center hover:bg-blue-dark transition-colors duration-200"
              >
                {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            </div>
            {!playing && (
              <button
                type="button"
                onClick={toggle}
                aria-label="Play video"
                className="absolute inset-0 flex items-center justify-center bg-blue-dark/20 hover:bg-blue-dark/10 transition-colors duration-300"
              >
                <span className="h-16 w-16 rounded-full bg-cream-light/90 text-green flex items-center justify-center">
                  <Play size={24} className="ml-0.5" />
                </span>
              </button>
            )}
          </>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="w-full max-h-[70vh] object-cover" />
        )}
      </div>
    </div>
  );
}
