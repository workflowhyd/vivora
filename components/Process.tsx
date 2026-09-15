"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useSpring } from "motion/react";
import { Reveal } from "./Reveal";
import { processStages } from "@/data/content";

export function Process() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.75", "end 0.4"],
  });
  const lineProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 22 });

  return (
    <section id="processing" ref={sectionRef} className="bg-ivory py-24 md:py-36">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <Reveal className="mb-16 md:mb-24 text-center max-w-xl mx-auto">
          <span className="label-caps text-[12px] text-forest">The Journey</span>
          <h2 className="font-display text-4xl md:text-6xl leading-[1.05] mt-4 text-near-black">
            From harvest
            <br />
            <span className="italic text-forest">to pack.</span>
          </h2>
        </Reveal>

        <div className="relative">
          <div className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-px bg-charcoal/12 md:-translate-x-1/2" />
          <motion.div
            className="absolute left-[19px] md:left-1/2 top-0 w-px bg-forest origin-top md:-translate-x-1/2"
            style={{ scaleY: lineProgress, height: "100%" }}
          />

          <div className="flex flex-col gap-14 md:gap-0">
            {processStages.map((stage, i) => {
              const fromLeft = i % 2 === 0;
              return (
                <div
                  key={stage.number}
                  className="relative md:grid md:grid-cols-2 md:gap-16 md:py-10 pl-12 md:pl-0"
                >
                  <motion.span
                    className="absolute left-0 md:left-1/2 top-0 md:top-1/2 h-10 w-10 md:-translate-x-1/2 md:-translate-y-1/2 rounded-full bg-ivory border-2 border-forest flex items-center justify-center text-forest font-display text-sm z-10"
                    initial={{ scale: 0.7, opacity: 0.5 }}
                    whileInView={{ scale: 1, opacity: 1, backgroundColor: "#16244a", color: "#fbf6ea" }}
                    viewport={{ once: true, amount: 0.7 }}
                    transition={{ duration: 0.5 }}
                  >
                    {stage.number}
                  </motion.span>

                  <motion.div
                    className={fromLeft ? "md:pr-8" : "md:col-start-2 md:pl-8"}
                    initial={{ opacity: 0, x: fromLeft ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div
                      className={`relative h-56 md:h-72 w-full max-w-md overflow-hidden rounded-[2px] ${
                        fromLeft ? "" : "md:ml-auto"
                      }`}
                    >
                      <Image
                        src={stage.image}
                        alt={`${stage.title} stage of the Vivora Foods production process`}
                        fill
                        sizes="(max-width: 768px) 100vw, 40vw"
                        className="object-cover"
                      />
                    </div>
                    <h3 className="font-display text-2xl md:text-3xl text-near-black mt-5">
                      {stage.title}
                    </h3>
                    <p className="text-charcoal/65 font-light mt-2 max-w-sm">{stage.description}</p>
                  </motion.div>

                  {fromLeft && <div className="hidden md:block" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
