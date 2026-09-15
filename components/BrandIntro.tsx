"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Reveal } from "./Reveal";
import { images } from "@/data/images";

export function BrandIntro() {
  return (
    <section className="relative bg-offwhite py-28 md:py-40 overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-10 md:gap-6 items-start">
          <div className="md:col-span-5">
            <Reveal>
              <span className="label-caps text-[12px] text-crimson">Rooted in Nature</span>
              <h2 className="font-display text-4xl md:text-[3.4rem] leading-[1.05] mt-5 text-near-black">
                Dry delicious.
                <br />
                <span className="italic text-forest">Nature goodness.</span>
              </h2>
            </Reveal>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <Reveal delay={0.15}>
              <p className="text-lg md:text-xl text-charcoal/80 font-light leading-relaxed max-w-lg">
                At Vivora Foods, we source, grade and pack premium dry
                fruits and nuts for retailers, gifting brands and food
                businesses around the world.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <a
                href="#about"
                className="inline-block mt-8 label-caps text-[13px] text-forest border-b-2 border-orange pb-1 hover:text-orange transition-colors duration-300"
              >
                Discover Our Story
              </a>
            </Reveal>
          </div>
        </div>

        <div className="relative mt-20 md:mt-28 h-[420px] md:h-[620px]">
          <motion.div
            className="absolute left-0 top-0 w-[62%] md:w-[56%] h-[78%] md:h-[85%] rounded-[2px] overflow-hidden"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={images.brandIntro.primary}
              alt="Almond orchard used in Vivora Foods' natural ingredient sourcing"
              fill
              sizes="(max-width: 768px) 62vw, 56vw"
              className="object-cover"
            />
          </motion.div>

          <motion.div
            className="absolute right-0 bottom-0 w-[52%] md:w-[38%] h-[58%] md:h-[62%] rounded-[2px] overflow-hidden shadow-2xl border-4 md:border-8 border-offwhite"
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={images.brandIntro.secondary}
              alt="Date palm plantation, source of Vivora Foods' dates"
              fill
              sizes="(max-width: 768px) 52vw, 38vw"
              className="object-cover"
            />
          </motion.div>

          <motion.span
            className="absolute right-2 md:right-6 top-4 md:top-10 font-display italic text-[18vw] md:text-[9rem] leading-none text-forest/[0.06] pointer-events-none select-none"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.3 }}
          >
            01
          </motion.span>
        </div>
      </div>
    </section>
  );
}
