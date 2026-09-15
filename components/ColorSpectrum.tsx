"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Reveal } from "./Reveal";
import { IngredientMound } from "./IngredientMound";
import { colorSpectrum } from "@/data/content";

export function ColorSpectrum() {
  return (
    <section className="relative bg-near-black py-24 md:py-36 overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <Reveal className="mb-16 md:mb-24 text-center max-w-2xl mx-auto">
          <span className="label-caps text-[12px] text-yellow">Nature&apos;s Palette</span>
          <h2 className="font-display text-4xl md:text-6xl leading-[1.05] mt-4 text-ivory">
            A spectrum of
            <br />
            <span className="italic">nature goodness.</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-3">
          {colorSpectrum.map((stage, i) => (
            <motion.div
              key={stage.label}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group relative"
            >
              <div className="relative h-[220px] md:h-[420px] overflow-hidden rounded-[2px]">
                <Image
                  src={stage.image}
                  alt={`${stage.ingredient} — natural source of the ${stage.label.toLowerCase()} tone in Vivora's palette`}
                  fill
                  sizes="(max-width: 768px) 50vw, 20vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div
                  className="absolute inset-0 mix-blend-multiply opacity-40 transition-opacity duration-500 group-hover:opacity-20"
                  style={{ backgroundColor: stage.color }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-near-black/80 via-transparent to-transparent" />

                <IngredientMound
                  color={stage.color}
                  className="absolute bottom-3 right-3 w-14 md:w-20"
                />

                <div className="absolute top-4 left-4 md:top-6 md:left-6">
                  <span className="label-caps text-[10px] md:text-[11px] text-ivory/70">
                    {stage.label}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
                  <h3 className="font-display text-lg md:text-2xl text-ivory">
                    {stage.ingredient}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
