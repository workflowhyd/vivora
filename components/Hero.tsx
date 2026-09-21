"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useContent } from "@/lib/useContent";
import { HeroBanner } from "./HeroBanner";

// The default banner artwork has its heading, copy and buttons baked in, so
// the real text below is visually hidden (kept for SEO / screen readers) and
// invisible links are laid over the two buttons in the artwork. Positions are
// percentages of the 2000×748 artwork, so they track it at any width.
const DEFAULT_BANNER = "/images/hero-banner.jpg";

const primaryClasses =
  "group inline-flex items-center gap-2 bg-green text-cream-light text-[13px] label-caps px-7 py-4 rounded-full hover:bg-green-dark transition-colors duration-300";
const secondaryClasses =
  "inline-flex items-center gap-2 text-blue text-[13px] label-caps px-7 py-4 rounded-full border border-blue/30 hover:border-blue transition-colors duration-300";

export function Hero() {
  const { t, media } = useContent();
  const video = media("home.hero.video");
  const customImage = media("home.hero.image");
  const usingDefaultArtwork = !video && !customImage;

  return (
    <section id="home" className="relative w-full bg-cream pt-24 md:pt-28">
      <h1 className="sr-only">
        {t("home.hero.titleMain")} {t("home.hero.titleAccent")}
      </h1>
      <p className="sr-only">
        {t("home.hero.eyebrow")} {t("home.hero.body")}
      </p>

      {usingDefaultArtwork ? (
        <div className="relative mx-auto w-full max-w-[2000px]">
          <Image
            src={DEFAULT_BANNER}
            alt="Vivora Foods — Dry Delicious. Nature Goodness. Dehydrated foods, powders and ready-to-cook products from India."
            width={2051}
            height={767}
            priority
            sizes="100vw"
            className="w-full h-auto"
          />
          <Link
            href="/products"
            aria-label={t("home.hero.cta1")}
            className="hidden md:block absolute rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            style={{ left: "6.7%", top: "68.6%", width: "14.6%", height: "7.9%" }}
          />
          <Link
            href="/contact"
            aria-label={t("home.hero.cta2")}
            className="hidden md:block absolute rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            style={{ left: "22.2%", top: "68.6%", width: "14.8%", height: "7.9%" }}
          />
        </div>
      ) : (
        <HeroBanner video={video} image={customImage} />
      )}

      {/* Touch-friendly buttons: the ones in the default artwork are too small on phones. */}
      <div
        className={`flex flex-wrap items-center justify-center gap-4 px-6 py-8 ${
          usingDefaultArtwork ? "md:hidden" : "md:py-10"
        }`}
      >
        <Link href="/products" className={primaryClasses}>
          {t("home.hero.cta1")}
          <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
        <Link href="/contact" className={secondaryClasses}>
          {t("home.hero.cta2")}
        </Link>
      </div>
    </section>
  );
}
