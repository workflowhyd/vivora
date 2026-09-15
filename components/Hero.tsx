"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { images } from "@/data/images";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section
      id="home"
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-near-black"
    >
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.4, ease: EASE }}
      >
        <Image
          src={images.hero}
          alt="A heap of premium roasted cashews — a Vivora Foods dry fruit"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-near-black/70 via-near-black/45 to-near-black/85" />
      <div className="absolute inset-0 bg-gradient-to-t from-forest/70 via-transparent to-transparent" />

      <div className="relative z-10 h-full flex flex-col justify-end md:justify-center px-6 md:px-10 pb-28 md:pb-0 max-w-[1440px] mx-auto">
        <motion.span
          className="label-caps text-[12px] md:text-[13px] text-yellow mb-5 md:mb-6 block"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
        >
          Premium Dry Fruits &amp; Nuts
        </motion.span>

        <h1 className="font-display text-ivory text-[13vw] leading-[0.98] md:text-[6.4vw] md:leading-[0.96] max-w-4xl overflow-hidden">
          {["Dry Delicious.", "Nature", "Goodness."].map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                className={i === 2 ? "italic text-orange inline-block" : "inline-block"}
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.5 + i * 0.14, ease: EASE }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          className="text-ivory/80 text-base md:text-lg max-w-md md:max-w-lg mt-6 md:mt-8 font-light"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.05, ease: EASE }}
        >
          Premium dry fruits, nuts and dehydrated snacks crafted from
          carefully selected natural ingredients — dry delicious, nature
          goodness.
        </motion.p>

        <div className="flex flex-wrap items-center gap-4 mt-9 md:mt-10">
          <motion.a
            href="#products"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.25, ease: EASE }}
            className="group inline-flex items-center gap-2 bg-ivory text-forest text-[13px] label-caps px-7 py-4 rounded-full hover:bg-yellow transition-colors duration-300"
          >
            Explore Products
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
          </motion.a>
          <motion.a
            href="#contact"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.4, ease: EASE }}
            className="inline-flex items-center gap-2 text-ivory text-[13px] label-caps px-7 py-4 rounded-full border border-ivory/40 hover:border-ivory transition-colors duration-300"
          >
            Talk to Us
          </motion.a>
        </div>
      </div>

      <motion.div
        className="absolute bottom-8 inset-x-0 px-6 md:px-10 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.8 }}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-center md:justify-start">
          <p className="label-caps text-[10px] md:text-[11px] text-ivory/60 tracking-[0.3em] text-center md:text-left">
            India <span className="text-orange mx-2">•</span> Natural Ingredients{" "}
            <span className="text-orange mx-2">•</span> Global Quality
          </p>
        </div>
      </motion.div>
    </section>
  );
}
