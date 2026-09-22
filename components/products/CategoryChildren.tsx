"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CategoryCard } from "./CategoryCard";
import { childrenOf } from "@/lib/categoryTree";
import type { ActiveCategories } from "@/lib/types";

// A category with sub-categories (e.g. "Dehydrated Products", "Vegetables") is
// a pure browsing page: it shows its children as cards instead of a product
// grid. Whoever renders this already confirmed `parentId` has children.
export function CategoryChildren({
  parentId,
  initial,
}: {
  parentId: string;
  initial: ActiveCategories;
}) {
  const categories = useQuery(api.categories.list, { activeOnly: true }) ?? initial;
  const children = childrenOf(categories, parentId);

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
      {children.map((category) => (
        <CategoryCard key={category.slug} category={category} />
      ))}
    </div>
  );
}
