"use client";

import { motion } from "motion/react";
import { Reveal } from "./Reveal";
import { globalDestinations, origin } from "@/data/content";

function arcPath(x1: number, y1: number, x2: number, y2: number) {
  const mx = (x1 + x2) / 2;
  const my = Math.min(y1, y2) - Math.abs(x2 - x1) * 0.22 - 6;
  return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
}

export function GlobalReach() {
  return (
    <section id="global-reach" className="bg-blue-dark py-24 md:py-36 overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <Reveal className="text-center max-w-xl mx-auto mb-16 md:mb-20">
          <span className="label-caps text-[12px] text-gold">Worldwide</span>
          <h2 className="font-display text-4xl md:text-6xl leading-[1.05] mt-4 text-cream-light">
            From India
            <br />
            <span className="italic">to the world.</span>
          </h2>
        </Reveal>

        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-[2px] border border-cream-light/10 bg-blue/25 overflow-hidden">
          <svg
            className="absolute inset-0 h-full w-full opacity-30"
            aria-hidden
          >
            <pattern id="dotgrid" width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1.1" fill="#fcf8ec" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#dotgrid)" />
          </svg>

          <svg
            viewBox="0 0 100 50"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
          >
            {globalDestinations.map((dest, i) => (
              <motion.path
                key={dest.name}
                d={arcPath(origin.x, origin.y * 0.5, dest.x, dest.y * 0.5)}
                fill="none"
                stroke="#b88a2a"
                strokeWidth="0.18"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.8 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 1.4, delay: 0.3 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              />
            ))}
          </svg>

          <div
            className="absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${origin.x}%`, top: `${origin.y}%` }}
          >
            <span className="absolute inset-0 rounded-full bg-gold animate-ping opacity-60" />
            <span className="relative block h-3.5 w-3.5 rounded-full bg-gold border-2 border-cream-light" />
            <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap label-caps text-[10px] md:text-[11px] text-cream-light">
              {origin.name}
            </span>
          </div>

          {globalDestinations.map((dest, i) => (
            <motion.div
              key={dest.name}
              className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${dest.x}%`, top: `${dest.y}%` }}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: 1 + i * 0.15 }}
            >
              <span className="block h-2 w-2 rounded-full bg-gold" />
              <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap label-caps text-[9px] md:text-[10px] text-cream-light/70">
                {dest.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
