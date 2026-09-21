"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { ArrowRight } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useContent } from "@/lib/useContent";
import { Reveal } from "@/components/Reveal";
import { ProductGrid } from "./ProductGrid";
import type { ActiveCategories, ProductCards } from "@/lib/types";

export function FeaturedProducts({
  initialProducts,
  initialCategories,
}: {
  initialProducts: ProductCards;
  initialCategories: ActiveCategories;
}) {
  const { t } = useContent();
  const products = useQuery(api.products.listCards, { featured: true }) ?? initialProducts;
  const categories = useQuery(api.categories.list, { activeOnly: true }) ?? initialCategories;

  const categoryNameById = new Map(categories.map((c) => [c._id, c.name]));

  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="flex items-end justify-between gap-6 mb-10 md:mb-14">
          <Reveal className="max-w-2xl">
            <span className="label-caps text-[12px] text-blue">{t("home.featured.eyebrow")}</span>
            <h2 className="font-display text-4xl md:text-5xl leading-[1.05] mt-4 text-blue-dark">
              {t("home.featured.titleMain")} <span className="italic text-blue">{t("home.featured.titleAccent")}</span>
            </h2>
          </Reveal>
          <Link
            href="/products"
            className="hidden md:inline-flex items-center gap-2 text-[13px] label-caps text-blue border-b-2 border-gold pb-1 hover:text-gold transition-colors duration-300 shrink-0"
          >
            View all products
            <ArrowRight size={14} />
          </Link>
        </div>

        <ProductGrid
          products={products.slice(0, 8).map((p) => ({
            slug: p.slug,
            name: p.name,
            shortDescription: p.shortDescription,
            categoryName: categoryNameById.get(p.categoryId),
          }))}
        />

        <div className="mt-10 md:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-[13px] label-caps text-blue border-b-2 border-gold pb-1"
          >
            View all products
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
