"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useContent } from "@/lib/useContent";
import { Logo } from "./Logo";
import { HeroBackgroundVideo } from "./HeroBackgroundVideo";

const EASE = [0.22, 1, 0.36, 1] as const;

// The logo sits as a small corner mark (like a site header) rather than
// leading the page, since a background video — when an admin sets one under
// Home → Hero in /admin/pages — needs the vertical space and central focus.
// With no video, this still renders as a quieter, image-free opening on a
// plain background.
export function Hero() {
  const { t, media } = useContent();
  const reduce = useReducedMotion();
  const video = media("home.hero.video");
  const customImage = media("home.hero.image");
  const hasBackground = Boolean(video || customImage);
  const sectionRef = useRef<HTMLElement>(null);

  const scrollToNext = () => {
    sectionRef.current?.nextElementSibling?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className={
        hasBackground
          ? "relative h-[100svh] w-full overflow-hidden bg-blue-dark"
          : "relative w-full bg-cream"
      }
    >
      <div className="absolute left-4 top-4 z-20 md:left-6 md:top-6">
        <Logo className="h-12 md:h-14" />
      </div>

      <button
        type="button"
        onClick={scrollToNext}
        aria-label="Scroll to next section"
        className={
          hasBackground
            ? "absolute bottom-5 right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-cream-light/15 text-cream-light backdrop-blur transition-colors duration-300 hover:bg-cream-light/25 md:bottom-8 md:right-8 md:h-12 md:w-12"
            : "absolute bottom-5 right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-blue/15 text-blue transition-colors duration-300 hover:bg-blue/5 md:bottom-8 md:right-8 md:h-12 md:w-12"
        }
      >
        <motion.span
          animate={reduce ? undefined : { y: [0, 4, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="flex"
        >
          <ChevronDown size={20} />
        </motion.span>
      </button>

      {hasBackground && (
        <>
          {video ? (
            <HeroBackgroundVideo video={video} poster={customImage} />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={customImage}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          )}
          {/* Scrim so the light text stays readable over arbitrary footage */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-dark/70 via-blue-dark/50 to-blue-dark/70" />
        </>
      )}

      <div
        className={
          hasBackground
            ? "relative z-10 mx-auto flex h-full max-w-2xl flex-col items-center justify-center px-6 text-center"
            : "mx-auto max-w-2xl px-6 pb-8 pt-24 text-center md:pb-12 md:pt-28"
        }
      >
        <motion.p
          className="font-display text-lg font-semibold tracking-wide md:text-xl"
          initial={{ opacity: 0, y: reduce ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <span className={hasBackground ? "text-cream-light" : "text-blue-dark"}>Vivora</span>{" "}
          <span className="text-gold">Foods</span>
        </motion.p>

        <motion.h1
          className={
            hasBackground
              ? "font-display mt-3 text-4xl leading-[1.08] tracking-tight text-cream-light md:text-6xl"
              : "font-display mt-3 text-4xl leading-[1.08] tracking-tight text-blue-dark md:text-6xl"
          }
          initial={{ opacity: 0, y: reduce ? 0 : 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
        >
          {t("home.hero.titleMain")}
          <br className="hidden sm:block" />{" "}
          <span className={hasBackground ? "italic text-gold" : "italic text-green"}>
            {t("home.hero.titleAccent")}
          </span>
        </motion.h1>

        <motion.p
          className={
            hasBackground
              ? "mx-auto mt-6 max-w-md text-[15px] font-light leading-relaxed text-cream-light/80 md:text-base"
              : "mx-auto mt-6 max-w-md text-[15px] font-light leading-relaxed text-charcoal/65 md:text-base"
          }
          initial={{ opacity: 0, y: reduce ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
        >
          {t("home.hero.body")}
        </motion.p>
      </div>
    </section>
  );
}
