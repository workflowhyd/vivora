"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { ArrowRight } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Reveal } from "@/components/Reveal";
import { ProductGrid } from "./ProductGrid";

export function FeaturedProducts() {
  const products = useQuery(api.products.list, { featured: true, activeOnly: true });
  const categories = useQuery(api.categories.list, { activeOnly: true });

  if (!products || !categories) return null;

  const categoryNameById = new Map(categories.map((c) => [c._id, c.name]));

  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="flex items-end justify-between gap-6 mb-10 md:mb-14">
          <Reveal className="max-w-2xl">
            <span className="label-caps text-[12px] text-crimson">Our Range</span>
            <h2 className="font-display text-4xl md:text-5xl leading-[1.05] mt-4 text-near-black">
              Featured <span className="italic text-forest">products.</span>
            </h2>
          </Reveal>
          <Link
            href="/products"
            className="hidden md:inline-flex items-center gap-2 text-[13px] label-caps text-forest border-b-2 border-orange pb-1 hover:text-orange transition-colors duration-300 shrink-0"
          >
            View all products
            <ArrowRight size={14} />
          </Link>
        </div>

        <ProductGrid
          products={products.slice(0, 8).map((p) => ({
            slug: p.slug,
            name: p.name,
            thumbnail: p.thumbnail,
            shortDescription: p.shortDescription,
            categoryName: categoryNameById.get(p.categoryId),
          }))}
        />

        <div className="mt-10 md:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-[13px] label-caps text-forest border-b-2 border-orange pb-1"
          >
            View all products
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
