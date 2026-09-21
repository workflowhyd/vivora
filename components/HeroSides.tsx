"use client";

import { motion, useReducedMotion } from "motion/react";
import { Leaf } from "lucide-react";
import { useContent } from "@/lib/useContent";

// Decorative side panels for the desktop hero, filling the space either side of
// the banner. They stretch to the banner's height; the richer bits (sprig, figures) only
// appear when the panel is wide enough, via container queries.
const panel =
  "@container hidden min-w-0 flex-col items-center justify-between overflow-hidden py-2 lg:flex";

const EASE = [0.22, 1, 0.36, 1] as const;

function Sprig({ sway }: { sway: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 60 150"
      className="h-28 w-12 origin-bottom overflow-visible text-green"
      aria-hidden
      animate={sway ? { rotate: [-3, 3, -3] } : undefined}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
    >
      <path d="M30 150 C 32 110, 28 60, 30 6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
      {[
        { y: 118, s: -1, gold: false },
        { y: 92, s: 1, gold: false },
        { y: 66, s: -1, gold: false },
        { y: 40, s: 1, gold: true },
        { y: 16, s: -1, gold: false },
      ].map((leaf) => (
        <path
          key={leaf.y}
          d="M0 0 C 8 -9 22 -9 30 0 C 22 9 8 9 0 0 Z"
          transform={`translate(30 ${leaf.y}) scale(${leaf.s}, 1) rotate(-28)`}
          fill={leaf.gold ? "#b88a2a" : "currentColor"}
          opacity={leaf.gold ? 0.85 : 0.55}
        />
      ))}
    </motion.svg>
  );
}

export function HeroSideLeft() {
  const reduce = useReducedMotion();
  return (
    <motion.aside
      aria-hidden
      className={panel}
      initial={{ opacity: 0, x: reduce ? 0 : -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1.4, delay: 0.7, ease: EASE }}
    >
      <div className="flex flex-col items-center gap-3 text-gold">
        <Leaf size={20} strokeWidth={1.4} />
        <span className="h-16 w-px bg-gold/50" />
      </div>

      <span
        className="label-caps rotate-180 whitespace-nowrap text-[11px] tracking-[0.4em] text-blue-dark/70"
        style={{ writingMode: "vertical-rl" }}
      >
        Dry Delicious &nbsp;·&nbsp; Nature Goodness
      </span>

      <div className="hidden @[110px]:block">
        <Sprig sway={!reduce} />
      </div>
    </motion.aside>
  );
}

export function HeroSideRight() {
  const reduce = useReducedMotion();
  const { t } = useContent();
  const figures = [1, 2, 3].map((n) => ({
    value: t(`stats.${n}.value`),
    label: t(`stats.${n}.label`),
  }));

  return (
    <motion.aside
      aria-hidden
      className={panel}
      initial={{ opacity: 0, x: reduce ? 0 : 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1.4, delay: 0.7, ease: EASE }}
    >
      <div className="hidden flex-col items-center gap-7 text-center @[130px]:flex">
        {figures.map((f) => (
          <div key={f.label}>
            <p className="font-display text-3xl leading-none text-blue-dark">{f.value}</p>
            <p className="label-caps mt-2 text-[9px] tracking-[0.25em] text-blue-dark/60">{f.label}</p>
          </div>
        ))}
      </div>
      <span className="@[130px]:hidden" />

      <div className="flex flex-col items-center gap-4">
        <span
          className="label-caps whitespace-nowrap text-[11px] tracking-[0.4em] text-blue-dark/70"
          style={{ writingMode: "vertical-rl" }}
        >
          Scroll
        </span>
        <span className="relative h-16 w-px overflow-hidden bg-gold/30">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-gold"
            animate={reduce ? undefined : { y: ["-100%", "200%"] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </div>
    </motion.aside>
  );
}
