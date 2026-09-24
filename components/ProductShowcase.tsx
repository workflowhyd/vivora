"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { useContent } from "@/lib/useContent";

// One image-and-text row introducing the product range in photos. The image
// itself is responsive — a portrait crop on phones/tablets, a landscape one
// on desktop — swapped by the browser via <picture>, so only the one in use
// is ever downloaded. Both photos and the copy are editable from
// /admin/pages/home; the photos here are just the defaults.
export function ProductShowcase() {
  const { t, media } = useContent();
  const mobileImage = media("home.showcase.imageMobile");
  const desktopImage = media("home.showcase.imageDesktop");
  if (!mobileImage && !desktopImage) return null;

  return (
    <section className="bg-cream py-16 md:py-24">
      <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-6 md:grid-cols-4 md:gap-16 md:px-10">
        <Reveal className="md:col-span-1">
          <picture>
            {desktopImage && <source media="(min-width: 768px)" srcSet={desktopImage} />}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mobileImage || desktopImage}
              alt={t("home.showcase.titleMain")}
              loading="lazy"
              className="w-full rounded-md object-cover shadow-[0_30px_60px_-25px_rgba(9,40,79,0.35)]"
            />
          </picture>
        </Reveal>
        <Reveal delay={0.1} className="md:col-span-3">
          <span className="label-caps text-[12px] text-green">{t("home.showcase.eyebrow")}</span>
          <h2 className="font-display mt-4 text-3xl leading-[1.1] text-blue-dark md:text-4xl">
            {t("home.showcase.titleMain")} <span className="italic text-green">{t("home.showcase.titleAccent")}</span>
          </h2>
          <p className="mt-5 max-w-md font-light leading-relaxed text-charcoal/70">{t("home.showcase.body")}</p>
          <Link
            href="/products"
            className="group mt-6 inline-flex items-center gap-2 text-[13px] label-caps text-blue border-b-2 border-gold pb-1 hover:text-gold transition-colors duration-300"
          >
            Explore the range
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
