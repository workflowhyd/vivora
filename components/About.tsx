"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { images } from "@/data/images";

export function About() {
  return (
    <section id="about" className="bg-offwhite py-16 md:py-24">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 grid md:grid-cols-12 gap-10 md:gap-8 items-center">
        <div className="md:col-span-7">
          <Reveal>
            <span className="label-caps text-[12px] text-crimson">The Vivora Story</span>
            <h2 className="font-display text-3xl md:text-4xl leading-[1.1] mt-4 text-near-black">
              Inspired by nature.
              <br />
              <span className="italic text-forest">Dry delicious, always.</span>
            </h2>
            <p className="text-charcoal/70 font-light leading-relaxed mt-5 max-w-lg">
              Every Vivora product begins with careful sourcing. From dehydration
              through to hygienic packing, we build a transparent, export-ready
              supply chain that food brands and distributors can rely on.
            </p>
            <a
              href="#quality"
              className="group inline-flex items-center gap-2 mt-6 text-[13px] label-caps text-forest border-b-2 border-orange pb-1 hover:text-orange transition-colors duration-300"
            >
              Discover Our Story
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </Reveal>
        </div>

        <div className="md:col-span-5 relative h-[240px] md:h-[280px] rounded-md overflow-hidden">
          <Image src={images.about.farm} alt="Vivora Foods processing" fill sizes="(max-width: 768px) 100vw, 35vw" className="object-cover" />
        </div>
      </div>
    </section>
  );
}
