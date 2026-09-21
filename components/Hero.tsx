"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useContent } from "@/lib/useContent";
import { Logo } from "./Logo";
import { HeroBanner } from "./HeroBanner";

const EASE = [0.22, 1, 0.36, 1] as const;
const DEFAULT_IMAGE = "/images/hero-products.jpg";

// Feathers the photo's edges into the page so it reads as a product shot
// sitting on the background instead of a rectangular banner: a vertical and a
// horizontal fade, intersected.
const featherMask = {
  maskImage:
    "linear-gradient(to bottom, transparent 0%, #000 11%, #000 84%, transparent 100%), linear-gradient(to right, transparent 0%, #000 10%, #000 90%, transparent 100%)",
  maskComposite: "intersect",
  WebkitMaskImage:
    "linear-gradient(to bottom, transparent 0%, #000 11%, #000 84%, transparent 100%), linear-gradient(to right, transparent 0%, #000 10%, #000 90%, transparent 100%)",
  WebkitMaskComposite: "source-in",
} as const;

export function Hero() {
  const { t, media } = useContent();
  const reduce = useReducedMotion();
  const video = media("home.hero.video");
  const customImage = media("home.hero.image");

  // Slow parallax: the product shot drifts up and grows a touch as it scrolls.
  const visualRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: visualRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [36, -36]);
  const scale = useTransform(scrollYProgress, [0, 0.5], reduce ? [1, 1] : [0.97, 1.03]);

  const rise = (delay: number, distance = 18) => ({
    initial: { opacity: 0, y: reduce ? 0 : distance },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.1, delay, ease: EASE },
  });

  return (
    <section
      id="home"
      className="relative w-full overflow-hidden bg-cream pt-12 md:pt-16"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 70% 45% at 50% 0%, rgba(23,107,58,0.07), transparent 70%), radial-gradient(ellipse 60% 40% at 50% 78%, rgba(184,138,42,0.10), transparent 70%)",
      }}
    >
      <div className="mx-auto flex max-w-[1440px] flex-col items-center px-6 text-center md:px-10">
        <motion.div {...rise(0, 0)} transition={{ duration: 1.2, ease: EASE }}>
          <Logo className="h-20 md:h-24 shadow-[0_10px_30px_-12px_rgba(9,40,79,0.35)]" />
        </motion.div>

        <motion.span
          className="label-caps mt-6 block text-[12px] tracking-[0.32em] text-green"
          {...rise(0.15, 10)}
        >
          {t("home.hero.eyebrow")}
        </motion.span>

        <motion.h1
          className="font-display mt-5 max-w-5xl text-balance text-[10.5vw] font-semibold leading-[1.05] tracking-tight text-blue-dark sm:text-6xl lg:text-7xl"
          {...rise(0.25, 24)}
        >
          <span className="block">{t("home.hero.titleMain")}</span>
          <span className="block italic text-green">{t("home.hero.titleAccent")}</span>
        </motion.h1>

        <motion.p
          className="mt-5 max-w-xl text-pretty text-base font-light leading-relaxed text-charcoal/70 md:max-w-2xl md:text-lg"
          {...rise(0.45)}
        >
          {t("home.hero.body")}
        </motion.p>

        <motion.div
          className="mt-7 flex flex-wrap items-center justify-center gap-4"
          {...rise(0.6)}
        >
          <Link
            href="/products"
            className="group label-caps inline-flex items-center gap-2 rounded-full bg-green px-8 py-4 text-[13px] text-cream-light transition-colors duration-300 hover:bg-green-dark"
          >
            {t("home.hero.cta1")}
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/contact"
            className="label-caps inline-flex items-center gap-2 rounded-full border border-blue/30 px-8 py-4 text-[13px] text-blue transition-colors duration-300 hover:border-blue"
          >
            {t("home.hero.cta2")}
          </Link>
        </motion.div>

        <motion.p
          className="font-display mt-6 text-lg italic text-gold md:text-xl"
          {...rise(0.75, 8)}
        >
          {t("home.hero.brandLine")}
        </motion.p>
      </div>

      <div ref={visualRef} className="relative mx-auto mt-4 w-full max-w-[1280px] pb-6 md:mt-0 md:px-6 md:pb-14">
        <motion.div
          style={{ y, scale }}
          initial={{ opacity: 0, scale: reduce ? 1 : 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, delay: 0.5, ease: EASE }}
        >
          {video ? (
            <HeroBanner video={video} image={customImage} />
          ) : (
            <div className="relative -ml-[10%] w-[120%] md:ml-0 md:w-full" style={featherMask}>
              {customImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={customImage} alt="" className="w-full h-auto" />
              ) : (
                <Image
                  src={DEFAULT_IMAGE}
                  alt="Vivora Foods dehydrated vegetable, fruit, ready-to-cook and spice powder packs surrounded by fresh produce and Indian ingredients"
                  width={1000}
                  height={548}
                  priority
                  sizes="(min-width: 1280px) 1280px, 100vw"
                  className="w-full h-auto"
                />
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
