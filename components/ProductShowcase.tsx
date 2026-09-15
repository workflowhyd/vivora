"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useQuery } from "convex/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { api } from "@/convex/_generated/api";

const NUMBER_WORDS: Record<number, string> = {
  8: "Eight",
  9: "Nine",
  10: "Ten",
  11: "Eleven",
  12: "Twelve",
};

function countWord(n: number) {
  return NUMBER_WORDS[n] ?? String(n);
}

export function ProductShowcase() {
  const products = useQuery(api.products.list);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);
  const [dragActive, setDragActive] = useState(false);

  const onPointerDown = (e: React.PointerEvent) => {
    const track = trackRef.current;
    if (!track) return;
    isDragging.current = true;
    setDragActive(true);
    startX.current = e.clientX;
    scrollStart.current = track.scrollLeft;
    track.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const track = trackRef.current;
    if (!track || !isDragging.current) return;
    track.scrollLeft = scrollStart.current - (e.clientX - startX.current);
  };

  const endDrag = () => {
    isDragging.current = false;
    setDragActive(false);
  };

  const scrollByAmount = (dir: number) => {
    trackRef.current?.scrollBy({ left: dir * 420, behavior: "smooth" });
  };

  if (!products) return null;

  return (
    <section id="products" className="bg-cream py-24 md:py-36 overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 flex items-end justify-between gap-6 mb-12 md:mb-16">
        <Reveal className="max-w-2xl">
          <span className="label-caps text-[12px] text-crimson">Our Range</span>
          <h2 className="font-display text-4xl md:text-6xl leading-[1.05] mt-4 text-near-black">
            {countWord(products.length)} products,
            <br />
            <span className="italic text-forest">endless occasions.</span>
          </h2>
        </Reveal>
        <div className="hidden md:flex gap-3 shrink-0">
          <button
            aria-label="Scroll left"
            onClick={() => scrollByAmount(-1)}
            className="h-12 w-12 rounded-full border border-charcoal/20 flex items-center justify-center hover:bg-forest hover:border-forest hover:text-ivory transition-colors duration-300"
          >
            <ArrowLeft size={18} />
          </button>
          <button
            aria-label="Scroll right"
            onClick={() => scrollByAmount(1)}
            className="h-12 w-12 rounded-full border border-charcoal/20 flex items-center justify-center hover:bg-forest hover:border-forest hover:text-ivory transition-colors duration-300"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        className={`flex gap-5 md:gap-8 overflow-x-auto no-scrollbar px-6 md:px-10 pb-4 snap-x snap-mandatory ${
          dragActive ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        {products.map((product) => (
          <div
            key={product.slug}
            className="group relative shrink-0 w-[78vw] sm:w-[52vw] md:w-[30vw] lg:w-[24vw] snap-start select-none"
          >
            <div className="relative h-[58vw] sm:h-[38vw] md:h-[24vw] lg:h-[19vw] max-h-[420px] overflow-hidden rounded-[2px] bg-charcoal/5">
              <Image
                src={product.image}
                alt={`${product.name} — a Vivora Foods product`}
                fill
                draggable={false}
                sizes="(max-width: 768px) 78vw, 26vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <span className="absolute top-3 left-3 label-caps text-[9px] text-ivory bg-near-black/55 backdrop-blur-sm rounded-full px-2.5 py-1">
                {product.category}
              </span>
            </div>
            <div className="mt-5 flex items-start justify-between gap-3">
              <div>
                <span className="label-caps text-[10px] text-forest/70">{product.category}</span>
                <h3 className="font-display text-xl md:text-2xl text-near-black mt-1">
                  {product.name}
                </h3>
                <p className="text-charcoal/65 text-sm mt-2 max-w-[26ch] font-light leading-relaxed">
                  {product.description}
                </p>
              </div>
              <span
                className="h-3 w-3 rounded-full shrink-0 mt-2"
                style={{ backgroundColor: product.accentColor }}
                aria-hidden
              />
            </div>
          </div>
        ))}
        <div className="shrink-0 w-2 md:w-4" aria-hidden />
      </div>
    </section>
  );
}
