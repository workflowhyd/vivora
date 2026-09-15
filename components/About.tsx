"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { images } from "@/data/images";

export function About() {
  return (
    <section id="about" className="bg-offwhite py-24 md:py-36">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 grid md:grid-cols-12 gap-12 md:gap-8 items-center">
        <div className="md:col-span-6 order-2 md:order-1">
          <Reveal>
            <span className="label-caps text-[12px] text-crimson">The Vivora Story</span>
            <h2 className="font-display text-4xl md:text-5xl leading-[1.1] mt-5 text-near-black">
              Inspired by nature.
              <br />
              <span className="italic text-forest">Dry delicious, always.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-charcoal/70 font-light leading-relaxed mt-7 max-w-md text-base md:text-lg">
              Every Vivora product begins its journey in the orchard. From
              careful sourcing through to hygienic packing, we build a
              transparent bridge between the harvest and the dry fruits and
              nuts food brands rely on.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <a
              href="#quality"
              className="group inline-flex items-center gap-2 mt-9 text-[13px] label-caps text-forest border-b-2 border-orange pb-1 hover:text-orange transition-colors duration-300"
            >
              Discover Our Story
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </Reveal>
        </div>

        <div className="md:col-span-6 order-1 md:order-2 relative h-[420px] md:h-[540px]">
          <motion.div
            className="absolute left-0 top-6 w-[54%] h-[62%] overflow-hidden rounded-[2px] shadow-xl"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image src={images.about.farm} alt="Vivora Foods sourcing orchard" fill sizes="30vw" className="object-cover" />
          </motion.div>

          <motion.div
            className="absolute right-0 top-0 w-[42%] h-[46%] overflow-hidden rounded-[2px] shadow-xl border-4 border-offwhite"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image src={images.about.orchard} alt="Date palm orchard" fill sizes="22vw" className="object-cover" />
          </motion.div>

          <motion.div
            className="absolute left-[8%] bottom-0 w-[44%] h-[40%] overflow-hidden rounded-[2px] shadow-xl border-4 border-offwhite"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image src={images.about.processing} alt="Processing facility" fill sizes="24vw" className="object-cover" />
          </motion.div>

          <motion.div
            className="absolute right-[2%] bottom-4 w-[38%] h-[44%] overflow-hidden rounded-[2px] shadow-2xl border-4 border-offwhite"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image src={images.about.finished} alt="Golden raisins — the finished result of Vivora Foods' process" fill sizes="20vw" className="object-cover" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
