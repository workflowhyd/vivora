"use client";

import { getImageProps } from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useContent } from "@/lib/useContent";
import { HeroBanner } from "./HeroBanner";

const EASE = [0.22, 1, 0.36, 1] as const;

// The default hero is a product banner (logo, tagline and products are in the
// artwork), so the real heading/copy below is visually hidden for search
// engines and screen readers. Art direction: a landscape banner on desktop,
// the portrait poster on phones and tablets. On phones the poster's own blurred, enlarged
// copy fills the space around it.
const BANNER = "/images/hero-banner.jpg";
const POSTER = "/images/hero-poster.jpg";
const POSTER_BLUR = "/images/hero-poster-blur.jpg";
const BANNER_ALT =
  "Vivora Foods — Dry Delicious. Goodness in every meal. Dehydrated onion, tomato, garlic, carrot and spinach powders and turmeric, chilli and coriander powder jars.";

// Custom (admin-uploaded) images keep their own proportions.
const customSize =
  "h-auto w-full max-w-md md:h-[calc(100svh-9.5rem)] md:min-h-[420px] md:w-auto md:max-w-full object-contain";

export function Hero() {
  const { t, media } = useContent();
  const reduce = useReducedMotion();
  const video = media("home.hero.video");
  const customImage = media("home.hero.image");
  const usingPoster = !video && !customImage;

  const { props: bannerProps } = getImageProps({
    src: BANNER,
    alt: BANNER_ALT,
    width: 1536,
    height: 1024,
    sizes: "100vw",
    priority: true,
  });
  const { props: posterProps } = getImageProps({
    src: POSTER,
    alt: BANNER_ALT,
    width: 1024,
    height: 1536,
    sizes: "100vw",
    priority: true,
  });

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

      <motion.div
        className="mx-auto w-full max-w-[2000px] px-4 pt-4 lg:px-0 lg:pt-0"
        initial={{ opacity: 0, scale: reduce ? 1 : 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: EASE }}
      >
        {video ? (
          <div className="mx-auto max-w-[1440px] md:px-10 md:pt-6">
            <HeroBanner video={video} image={customImage} />
          </div>
        ) : usingPoster ? (
          <picture>
            <source media="(min-width: 1024px)" srcSet={bannerProps.srcSet} sizes="100vw" />
            {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
            <img
              {...posterProps}
              className="mx-auto h-auto w-full max-w-md rounded-[4px] shadow-[0_30px_80px_-30px_rgba(9,40,79,0.55)] md:max-w-lg lg:h-[calc(100svh-9.5rem)] lg:min-h-[440px] lg:max-w-none lg:rounded-none lg:object-cover lg:object-[center_12%] lg:shadow-none"
            />
          </picture>
        ) : (
          <div className="flex justify-center md:pt-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={customImage} alt="" className={customSize} />
          </div>
        )}
      </motion.div>

      <div className="mx-auto flex max-w-[1440px] flex-col items-center px-4 pb-8 md:px-10">
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
