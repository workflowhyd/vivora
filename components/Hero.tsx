"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useContent } from "@/lib/useContent";
import { HeroBanner } from "./HeroBanner";

const EASE = [0.22, 1, 0.36, 1] as const;

// The default hero is a full product poster (logo, tagline and products are in
// the artwork), so the real heading/copy below is visually hidden for search
// engines and screen readers. The poster's own blurred, enlarged copy fills
// the space around it so it sits in the page instead of floating on blank cream.
const POSTER = "/images/hero-poster.jpg";
const POSTER_BLUR = "/images/hero-poster-blur.jpg";

// Poster height leaves room for the button row and the floating dock.
const posterSize =
  "h-auto w-full max-w-md md:h-[calc(100svh-12rem)] md:min-h-[420px] md:w-auto md:max-w-full";

export function Hero() {
  const { t, media } = useContent();
  const reduce = useReducedMotion();
  const video = media("home.hero.video");
  const customImage = media("home.hero.image");
  const usingPoster = !video && !customImage;

  return (
    <section id="home" className="relative isolate w-full overflow-hidden bg-cream">
      {usingPoster && (
        <div
          aria-hidden
          className="absolute inset-0 -z-10 scale-125 opacity-60 blur-2xl"
          style={{
            backgroundImage: `url(${POSTER_BLUR})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}

      <h1 className="sr-only">
        {t("home.hero.titleMain")} {t("home.hero.titleAccent")}
      </h1>
      <p className="sr-only">
        {t("home.hero.eyebrow")} {t("home.hero.body")}
      </p>

      <div className="mx-auto flex max-w-[1440px] flex-col items-center px-4 pb-8 pt-4 md:px-10 md:pt-6">
        <motion.div
          className="w-full"
          initial={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: EASE }}
        >
          {video ? (
            <HeroBanner video={video} image={customImage} />
          ) : (
            <div className="flex justify-center">
              {usingPoster ? (
                <Image
                  src={POSTER}
                  alt="Vivora Foods — Dry Delicious. Goodness in every meal. Dehydrated onion, tomato, garlic, carrot and spinach powders and turmeric, chilli and coriander powder jars."
                  width={1024}
                  height={1536}
                  priority
                  sizes="(min-width: 768px) 500px, 100vw"
                  className={`${posterSize} rounded-[4px] object-contain shadow-[0_30px_80px_-30px_rgba(9,40,79,0.55)]`}
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={customImage} alt="" className={`${posterSize} object-contain`} />
              )}
            </div>
          )}
        </motion.div>

        <motion.div
          className="mt-6 flex flex-wrap items-center justify-center gap-3 md:gap-4"
          initial={{ opacity: 0, y: reduce ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: EASE }}
        >
          <Link
            href="/products"
            className="group label-caps inline-flex items-center gap-2 rounded-full bg-green px-7 py-3.5 text-[13px] text-cream-light transition-colors duration-300 hover:bg-green-dark"
          >
            {t("home.hero.cta1")}
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/contact"
            className="label-caps inline-flex items-center gap-2 rounded-full border border-blue/30 bg-cream/70 px-7 py-3.5 text-[13px] text-blue backdrop-blur transition-colors duration-300 hover:border-blue"
          >
            {t("home.hero.cta2")}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
