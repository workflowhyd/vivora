"use client";

import { useRef } from "react";
import { useQuery } from "convex/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Reveal } from "./Reveal";
import { ProductCard } from "./products/ProductCard";
import type { ProductCards } from "@/lib/types";

const MAX = 8;

// A horizontally-scrolling preview of up to 8 products (in catalogue
// order) with the same card — photo, category, name, short description —
// used everywhere else, rather than a cut-down "featured" variant.
export function ProductSlider({ initial }: { initial: ProductCards }) {
  const products = (useQuery(api.products.listCards, {}) ?? initial).slice(0, MAX);
  const trackRef = useRef<HTMLDivElement>(null);

  if (products.length === 0) return null;

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-slide]");
    const step = (card?.offsetWidth ?? el.clientWidth * 0.8) + 20;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section className="bg-cream-light py-16 md:py-24">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <Reveal className="mb-10 flex items-end justify-between gap-6 md:mb-14">
          <h2 className="font-display text-3xl leading-[1.05] text-blue-dark md:text-5xl">
            Popular <span className="italic text-blue">products</span>
          </h2>
          <div className="hidden shrink-0 items-center gap-2 md:flex">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Previous products"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-blue/15 text-blue transition-colors duration-300 hover:bg-blue/5"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Next products"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-blue/15 text-blue transition-colors duration-300 hover:bg-blue/5"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </Reveal>

        <div
          ref={trackRef}
          className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 md:mx-0 md:px-0"
        >
          {products.map((product) => (
            <div
              key={product._id}
              data-slide
              className="w-[68%] shrink-0 snap-start sm:w-[42%] md:w-[30%] lg:w-[23%]"
            >
              <ProductCard
                product={{
                  slug: product.slug,
                  name: product.name,
                  shortDescription: product.shortDescription,
                  thumbnail: product.thumbnail,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
