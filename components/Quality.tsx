"use client";

import { Leaf, ShieldCheck, Sparkles, Globe2 } from "lucide-react";
import { Reveal, RevealGroup, revealItem } from "./Reveal";
import { motion } from "motion/react";
import { qualityPillars } from "@/data/content";

const icons = [Leaf, ShieldCheck, Sparkles, Globe2];
const accentClasses = ["text-gold", "text-cream-light", "text-gold", "text-cream-light"];

export function Quality() {
  return (
    <section id="quality" className="bg-green py-24 md:py-36">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <Reveal className="max-w-2xl">
          <span className="label-caps text-[12px] text-gold">Our Standard</span>
          <h2 className="font-display text-4xl md:text-6xl leading-[1.05] mt-4 text-cream-light">
            Quality you can
            <br />
            <span className="italic">build a product around.</span>
          </h2>
        </Reveal>

        <RevealGroup className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-14 mt-20">
          {qualityPillars.map((pillar, i) => {
            const Icon = icons[i];
            return (
              <motion.div key={pillar.title} variants={revealItem} className="border-t border-cream-light/15 pt-7">
                <Icon size={28} strokeWidth={1.25} className={accentClasses[i]} />
                <h3 className="font-display text-xl md:text-2xl text-cream-light mt-6">{pillar.title}</h3>
                <p className="text-cream-light/60 font-light mt-3 text-sm leading-relaxed">
                  {pillar.description}
                </p>
              </motion.div>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
