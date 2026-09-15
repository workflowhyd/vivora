"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { applications } from "@/data/content";

export function Applications() {
  return (
    <section id="applications" className="bg-offwhite py-24 md:py-36">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <Reveal className="mb-14 md:mb-20">
          <span className="label-caps text-[12px] text-crimson">Where It Goes</span>
          <h2 className="font-display text-4xl md:text-6xl leading-[1.05] mt-4 text-near-black max-w-2xl">
            Made for what
            <br />
            <span className="italic text-forest">comes next.</span>
          </h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
          {applications.map((app, i) => (
            <motion.div
              key={app.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.9, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group relative h-[420px] md:h-[520px] overflow-hidden rounded-[2px]"
            >
              <Image
                src={app.image}
                alt={`${app.title} — ${app.description}`}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-near-black/85 via-near-black/20 to-transparent" />

              <div
                className="absolute top-0 left-0 h-1 w-full origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                style={{ backgroundColor: app.accent }}
              />

              <div className="relative h-full flex flex-col justify-between p-7 md:p-9">
                <div className="flex items-center justify-between">
                  <span className="label-caps text-[12px]" style={{ color: app.accent }}>
                    {app.number}
                  </span>
                  <div className="h-11 w-11 rounded-full border border-ivory/40 flex items-center justify-center transition-all duration-500 group-hover:bg-ivory">
                    <ArrowUpRight size={18} className="text-ivory transition-all duration-500 group-hover:text-forest group-hover:rotate-45" />
                  </div>
                </div>
                <div>
                  <h3 className="font-display text-3xl md:text-4xl text-ivory">{app.title}</h3>
                  <p className="text-ivory/75 font-light mt-3 max-w-xs">{app.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
