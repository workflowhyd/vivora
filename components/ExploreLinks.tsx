"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal, RevealGroup, revealItem } from "./Reveal";
import { motion } from "motion/react";

const links = [
  {
    href: "/applications",
    title: "Applications",
    description: "Where our products go — gifting, retail, bakery and HoReCa.",
  },
  {
    href: "/quality",
    title: "Quality",
    description: "Our sourcing, grading and hygiene standards.",
  },
  {
    href: "/processing",
    title: "Processing",
    description: "From harvest to pack — how it's made.",
  },
  {
    href: "/global-reach",
    title: "Global Reach",
    description: "Exporting from India to the world.",
  },
];

export function ExploreLinks() {
  return (
    <section className="bg-cream py-16 md:py-24 border-t border-charcoal/10">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <Reveal className="mb-10 md:mb-14 max-w-2xl">
          <h2 className="font-display text-3xl md:text-5xl leading-[1.05] text-blue-dark">
            More about <span className="italic text-blue">Vivora.</span>
          </h2>
        </Reveal>

        <RevealGroup className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {links.map((link) => (
            <motion.div key={link.href} variants={revealItem}>
              <Link
                href={link.href}
                className="group block h-full rounded-md border border-charcoal/10 p-6 hover:border-blue/30 transition-colors duration-300"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-xl text-blue-dark">{link.title}</h3>
                  <ArrowUpRight
                    size={18}
                    className="text-blue shrink-0 mt-1 transition-transform duration-300 group-hover:rotate-45"
                  />
                </div>
                <p className="text-charcoal/60 text-sm mt-2.5 font-light leading-relaxed">
                  {link.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
