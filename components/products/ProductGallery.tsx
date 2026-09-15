"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-md bg-charcoal/5">
        {current && (
          <Image
            src={current}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 45vw"
            className="object-cover"
            priority
          />
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-3 mt-4 overflow-x-auto no-scrollbar">
          {images.map((image, i) => (
            <button
              key={image + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1} of ${images.length}`}
              className={cn(
                "relative h-16 w-16 md:h-20 md:w-20 shrink-0 rounded-[2px] overflow-hidden border-2 transition-colors duration-200",
                i === active ? "border-forest" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <Image src={image} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
