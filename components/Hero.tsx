"use client";

import { motion, useReducedMotion } from "motion/react";
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

  return (
    <section
      id="home"
      className={
        hasBackground
          ? "relative w-full overflow-hidden bg-blue-dark"
          : "relative w-full bg-cream"
      }
    >
      <div className="absolute left-4 top-4 z-20 md:left-6 md:top-6">
        <Logo className="h-12 md:h-14" />
      </div>

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
            ? "relative z-10 mx-auto flex min-h-[85svh] max-w-2xl flex-col items-center justify-center px-6 py-24 text-center md:min-h-[90svh]"
            : "mx-auto max-w-2xl px-6 pb-8 pt-24 text-center md:pb-12 md:pt-28"
        }
      >
        <motion.h1
          className={
            hasBackground
              ? "font-display text-4xl leading-[1.08] tracking-tight text-cream-light md:text-6xl"
              : "font-display text-4xl leading-[1.08] tracking-tight text-blue-dark md:text-6xl"
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
