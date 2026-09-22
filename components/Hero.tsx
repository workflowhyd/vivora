"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useContent } from "@/lib/useContent";
import { HeroBanner } from "./HeroBanner";

const EASE = [0.22, 1, 0.36, 1] as const;

// A quiet, logo-led opening: the mark, a heading and a line of copy on a
// plain background — no default banner photography. An admin can still add a
// video or image under Home → Hero in /admin/pages; when set, it shows below
// the text instead of nothing.
const LOGO = "/images/vivora-logo-full.jpg";

// Custom (admin-uploaded) images keep their own proportions.
const mediaSize =
  "h-auto w-full max-w-md md:h-[calc(100svh-9.5rem)] md:min-h-[380px] md:w-auto md:max-w-full object-contain";

export function Hero() {
  const { t, media } = useContent();
  const reduce = useReducedMotion();
  const video = media("home.hero.video");
  const customImage = media("home.hero.image");

  return (
    <section id="home" className="relative w-full bg-cream">
      <div className="mx-auto max-w-2xl px-6 pb-8 pt-14 text-center md:pb-12 md:pt-20">
        <motion.div
          initial={{ opacity: 0, scale: reduce ? 1 : 0.92, y: reduce ? 0 : -6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE }}
        >
          <Image
            src={LOGO}
            alt="Vivora Foods — Dry Delicious"
            width={1254}
            height={1254}
            priority
            sizes="(min-width: 768px) 220px, 160px"
            className="mx-auto h-32 w-32 object-contain md:h-44 md:w-44"
          />
        </motion.div>

        <motion.h1
          className="font-display mt-6 text-4xl leading-[1.08] tracking-tight text-blue-dark md:text-6xl"
          initial={{ opacity: 0, y: reduce ? 0 : 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
        >
          {t("home.hero.titleMain")}
          <br className="hidden sm:block" />{" "}
          <span className="italic text-green">{t("home.hero.titleAccent")}</span>
        </motion.h1>

        <motion.p
          className="mx-auto mt-6 max-w-md text-[15px] font-light leading-relaxed text-charcoal/65 md:text-base"
          initial={{ opacity: 0, y: reduce ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
        >
          {t("home.hero.body")}
        </motion.p>
      </div>

      {(video || customImage) && (
        <motion.div
          className="mx-auto max-w-[1440px] px-4 pb-10 md:px-10"
          initial={{ opacity: 0, scale: reduce ? 1 : 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: EASE }}
        >
          {video ? (
            <HeroBanner video={video} image={customImage} />
          ) : (
            <div className="flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={customImage} alt="" className={mediaSize} />
            </div>
          )}
        </motion.div>
      )}
    </section>
  );
}
