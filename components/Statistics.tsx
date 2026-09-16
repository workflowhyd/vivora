"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "motion/react";
import { statistics } from "@/data/content";

function StatValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState(value);
  const numericMatch = value.match(/^(\d+)(\+?)$/);

  useEffect(() => {
    if (!inView || !numericMatch) return;
    const target = parseInt(numericMatch[1], 10);
    const suffix = numericMatch[2];
    const controls = animate(0, target, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(`${Math.round(v)}${suffix}`),
    });
    return () => controls.stop();
  }, [inView, numericMatch]);

  return (
    <span ref={ref} className="font-display text-5xl md:text-7xl text-cream-light">
      {numericMatch ? display : value}
    </span>
  );
}

export function Statistics() {
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
              <StatValue value={stat.value} />
              <p className="label-caps text-[11px] text-cream-light/50 mt-3">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
