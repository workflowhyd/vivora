"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "motion/react";
import { statistics } from "@/data/content";
import { useContent } from "@/lib/useContent";

// Counts up to numeric values ("30+", "100") the first time they scroll into
// view. The effect depends only on primitives: depending on a fresh regex match
// array restarted the animation on every frame's re-render, so the number
// flickered back to 0. `display` is null whenever the final value should show.
function StatValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState<string | null>(null);

  const match = value.match(/^(\d+)(\+?)$/);
  const target = match ? parseInt(match[1], 10) : null;
  const suffix = match?.[2] ?? "";

  useEffect(() => {
    if (!inView || target === null) return;
    const controls = animate(0, target, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(`${Math.round(v)}${suffix}`),
      onComplete: () => setDisplay(null),
    });
    return () => controls.stop();
  }, [inView, target, suffix]);

  return (
    <span ref={ref} className="font-display text-5xl md:text-7xl text-cream-light">
      {display ?? value}
    </span>
  );
}

export function Statistics() {
  const { t } = useContent();
  return (
    <section className="bg-blue-dark py-24 md:py-32">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 md:gap-6">
          {statistics.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: i * 0.08 }}
              className="text-center lg:text-left border-t border-cream-light/10 pt-6"
            >
              <StatValue value={t(`stats.${i + 1}.value`)} />
              <p className="label-caps text-[11px] text-cream-light/50 mt-3">{t(`stats.${i + 1}.label`)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
