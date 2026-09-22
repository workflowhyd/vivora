"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { useContent } from "@/lib/useContent";

// Two image-and-text rows introducing the product range in photos, alternating
// sides on desktop. Both the copy and the image are editable from
// /admin/pages/home — the images here are just the defaults.
function ShowcaseRow({ prefix, reverse }: { prefix: "home.showcase1" | "home.showcase2"; reverse?: boolean }) {
  const { t, media } = useContent();
  const image = media(`${prefix}.image`);
  if (!image) return null;

  return (
    <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
      <Reveal className={reverse ? "md:order-2" : undefined}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={t(`${prefix}.titleMain`)}
          loading="lazy"
          className="w-full rounded-md object-cover shadow-[0_30px_60px_-25px_rgba(9,40,79,0.35)]"
        />
      </Reveal>
      <Reveal delay={0.1} className={reverse ? "md:order-1" : undefined}>
        <span className="label-caps text-[12px] text-green">{t(`${prefix}.eyebrow`)}</span>
        <h2 className="font-display mt-4 text-3xl leading-[1.1] text-blue-dark md:text-4xl">
          {t(`${prefix}.titleMain`)} <span className="italic text-green">{t(`${prefix}.titleAccent`)}</span>
        </h2>
        <p className="mt-5 max-w-md font-light leading-relaxed text-charcoal/70">{t(`${prefix}.body`)}</p>
        <Link
          href="/products"
          className="group mt-6 inline-flex items-center gap-2 text-[13px] label-caps text-blue border-b-2 border-gold pb-1 hover:text-gold transition-colors duration-300"
        >
          Explore the range
          <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </Reveal>
    </div>
  );
}

export function ProductShowcase() {
  return (
    <section className="bg-cream py-16 md:py-24">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-16 px-6 md:gap-24 md:px-10">
        <ShowcaseRow prefix="home.showcase1" />
        <ShowcaseRow prefix="home.showcase2" reverse />
      </div>
    </section>
  );
}
