"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useQuery } from "convex/react";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { api } from "@/convex/_generated/api";

export function ProductCategories() {
  const categories = useQuery(api.categories.list);

  if (!categories) return null;

  return (
    <section className="bg-offwhite pb-6 md:pb-10">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <Reveal className="mb-14 md:mb-20">
          <h2 className="font-display text-4xl md:text-6xl leading-[1.05] text-near-black max-w-2xl">
            From orchard
            <br />
            <span className="italic text-forest">to dry delicious.</span>
          </h2>
        </Reveal>
      </div>

      <div className="flex flex-col">
        {categories.map((category, i) => (
          <motion.a
            key={category.slug}
            href={`#products`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="group relative h-[70vh] md:h-[86vh] w-full overflow-hidden border-t border-charcoal/10 first:border-t-0"
          >
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src={category.image}
                alt={`${category.title} — ${category.description}`}
                fill
                sizes="100vw"
                className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-near-black/85 via-near-black/25 to-near-black/10 transition-opacity duration-700 group-hover:from-near-black/90" />
            </div>

            <div className="relative h-full mx-auto max-w-[1440px] px-6 md:px-10 flex flex-col justify-end pb-12 md:pb-16">
              <div className="flex items-end justify-between gap-6 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-2">
                <div>
                  <span className="label-caps text-[13px] text-yellow">{category.number}</span>
                  <h3 className="font-display text-4xl md:text-6xl text-ivory mt-3 md:mt-4">
                    {category.title}
                  </h3>
                  <p className="text-ivory/75 max-w-md mt-4 text-base md:text-lg font-light">
                    {category.description}
                  </p>
                </div>
                <div className="hidden md:flex h-16 w-16 shrink-0 rounded-full border border-ivory/40 items-center justify-center transition-all duration-500 group-hover:bg-ivory group-hover:border-ivory">
                  <ArrowUpRight
                    size={24}
                    className="text-ivory transition-all duration-500 group-hover:text-forest group-hover:rotate-45"
                  />
                </div>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
