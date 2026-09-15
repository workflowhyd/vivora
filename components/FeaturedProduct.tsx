"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "./Reveal";
import { images } from "@/data/images";

const features = [
  "Carefully sourced",
  "Consistent quality",
  "Convenient storage",
  "Multiple applications",
];

export function FeaturedProduct() {
  return (
    <section className="bg-offwhite">
      <div className="grid md:grid-cols-2">
        <motion.div
          className="relative h-[52vh] md:h-[92vh] overflow-hidden"
          initial={{ opacity: 0, scale: 1.05 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={images.featuredProduct}
            alt="Close-up of shelled walnut halves — Vivora Foods' signature nut collection"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-near-black/30 md:bg-gradient-to-r md:from-transparent md:to-near-black/10" />
        </motion.div>

        <div className="flex items-center px-6 md:px-16 lg:px-24 py-16 md:py-0 bg-forest">
          <div className="max-w-lg">
            <Reveal>
              <span className="label-caps text-[12px] text-yellow">Signature Collection</span>
              <h2 className="font-display text-4xl md:text-5xl leading-[1.08] mt-5 text-ivory">
                All the goodness.
                <br />
                <span className="italic text-orange">None of the compromise.</span>
              </h2>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="text-ivory/75 font-light leading-relaxed mt-7 text-base md:text-lg">
                Every kernel is hand-sorted and graded before it&apos;s
                packed, so what reaches you keeps its natural character,
                crunch and flavour.
              </p>
            </Reveal>

            <Reveal delay={0.25}>
              <ul className="mt-9 grid grid-cols-2 gap-x-4 gap-y-4">
                {features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 text-ivory/90 text-sm">
                    <Check size={16} className="text-yellow shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.35}>
              <a
                href="#products"
                className="group inline-flex items-center gap-2 mt-10 text-[13px] label-caps text-forest bg-ivory rounded-full px-7 py-4 hover:bg-yellow transition-colors duration-300"
              >
                Explore Products
                <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
