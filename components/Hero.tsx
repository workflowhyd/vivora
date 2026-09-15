"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { images } from "@/data/images";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section id="home" className="relative w-full bg-offwhite pt-32 md:pt-40 pb-14 md:pb-20">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 grid md:grid-cols-12 gap-10 md:gap-12 items-center">
        <div className="md:col-span-7">
          <motion.span
            className="label-caps text-[12px] text-crimson block"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            Dehydrated Foods, Powders &amp; Ready-to-Cook — Export Quality
          </motion.span>

          <motion.h1
            className="font-display text-near-black text-[11vw] leading-[1.02] md:text-6xl md:leading-[1.05] mt-4 max-w-xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          >
            Dry Delicious. <span className="italic text-forest">Nature Goodness.</span>
          </motion.h1>

          <motion.p
            className="text-charcoal/70 text-base md:text-lg max-w-md mt-6 font-light leading-relaxed"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          >
            Vivora Foods supplies premium dehydrated vegetables, fruits, powders and
            ready-to-cook products from India — sourced, processed and packed for
            B2B buyers, distributors and retailers worldwide.
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-4 mt-8"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          >
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 bg-forest text-ivory text-[13px] label-caps px-7 py-4 rounded-full hover:bg-near-black transition-colors duration-300"
            >
              View Products
              <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-forest text-[13px] label-caps px-7 py-4 rounded-full border border-forest/30 hover:border-forest transition-colors duration-300"
            >
              Request a Quote
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="md:col-span-5 relative h-[32vh] md:h-[42vh] max-h-[420px] rounded-md overflow-hidden"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.15, ease: EASE }}
        >
          <Image
            src={images.hero}
            alt="Dehydrated vegetables and spice powders — Vivora Foods products"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
