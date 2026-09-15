"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { ProductGrid } from "./ProductGrid";

export function CategoryProductGrid({ categoryId }: { categoryId: Id<"categories"> }) {
  const products = useQuery(api.products.listByCategory, { categoryId, activeOnly: true });

  if (!products) {
    return <div className="py-16 text-center text-charcoal/50">Loading products…</div>;
  }

  return (
    <ProductGrid
      products={products.map((p) => ({
        slug: p.slug,
        name: p.name,
        thumbnail: p.thumbnail,
        shortDescription: p.shortDescription,
      }))}
      emptyState="No products in this category yet."
    />
  );
}
