"use client";

import { useQuery } from "convex/react";
import { Reveal } from "./Reveal";
import { CategoryCard } from "./products/CategoryCard";
import { api } from "@/convex/_generated/api";
import { useContent } from "@/lib/useContent";
import { topLevel } from "@/lib/categoryTree";
import type { ActiveCategories } from "@/lib/types";

export function ProductCategories({ initial }: { initial: ActiveCategories }) {
  const { t } = useContent();
  // Only the top-level groups — Dehydrated Products' own sub-categories (and
  // theirs) show once a visitor drills into that category's page.
  const categories = topLevel(useQuery(api.categories.list, { activeOnly: true }) ?? initial);

  return (
    <section className="bg-cream py-16 md:py-24">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <Reveal className="mb-10 md:mb-14 max-w-2xl">
          <h2 className="font-display text-3xl md:text-5xl leading-[1.05] text-blue-dark">
            {t("home.categories.titleMain")}
            <br />
            <span className="italic text-blue">{t("home.categories.titleAccent")}</span>
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
