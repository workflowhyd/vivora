"use client";

import { useQuery } from "convex/react";
import { Reveal } from "./Reveal";
import { CategoryCard } from "./products/CategoryCard";
import { api } from "@/convex/_generated/api";

export function ProductCategories() {
  const categories = useQuery(api.categories.list, { activeOnly: true });

  if (!categories) return null;

  return (
    <section className="bg-offwhite py-16 md:py-24">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <Reveal className="mb-10 md:mb-14 max-w-2xl">
          <h2 className="font-display text-3xl md:text-5xl leading-[1.05] text-near-black">
            From harvest
            <br />
            <span className="italic text-forest">to dry delicious.</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
