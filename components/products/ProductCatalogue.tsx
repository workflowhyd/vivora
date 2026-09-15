"use client";

import { useMemo } from "react";
import { useQuery } from "convex/react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { ProductGrid } from "./ProductGrid";
import { ProductFilters, type SortOption } from "./ProductFilters";

export function ProductCatalogue() {
  const products = useQuery(api.products.list, { activeOnly: true });
  const categories = useQuery(api.categories.list, { activeOnly: true });
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category");
  const search = searchParams.get("q") ?? "";
  const sort = (searchParams.get("sort") as SortOption) || "featured";
  const featuredOnly = searchParams.get("featured") === "1";

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const categoryNameById = useMemo(() => {
    const map = new Map<string, string>();
    categories?.forEach((c) => map.set(c._id, c.name));
    return map;
  }, [categories]);

  const filtered = useMemo(() => {
    if (!products) return [];
    let result = products;

    if (activeCategory) {
      const category = categories?.find((c) => c.slug === activeCategory);
      if (category) result = result.filter((p) => p.categoryId === category._id);
    }
    if (featuredOnly) {
      result = result.filter((p) => p.featured);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q)
      );
    }

    const sorted = [...result];
    if (sort === "name-asc") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "newest") {
      sorted.sort((a, b) => b.createdAt - a.createdAt);
    } else {
      sorted.sort((a, b) => Number(b.featured) - Number(a.featured) || a.sortOrder - b.sortOrder);
    }
    return sorted;
  }, [products, categories, activeCategory, featuredOnly, search, sort]);

  if (!products || !categories) {
    return <div className="py-16 text-center text-charcoal/50">Loading products…</div>;
  }

  return (
    <div>
      <ProductFilters
        categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
        activeCategory={activeCategory}
        search={search}
        sort={sort}
        featuredOnly={featuredOnly}
        onCategoryChange={(slug) => updateParams({ category: slug })}
        onSearchChange={(value) => updateParams({ q: value || null })}
        onSortChange={(value) => updateParams({ sort: value === "featured" ? null : value })}
        onFeaturedOnlyChange={(value) => updateParams({ featured: value ? "1" : null })}
      />

      <p className="text-charcoal/50 text-sm mt-6 mb-6">
        {filtered.length} {filtered.length === 1 ? "product" : "products"}
      </p>

      <ProductGrid
        products={filtered.map((p) => ({
          slug: p.slug,
          name: p.name,
          thumbnail: p.thumbnail,
          shortDescription: p.shortDescription,
          categoryName: categoryNameById.get(p.categoryId),
        }))}
        emptyState="No products match your filters — try clearing the search or category."
      />
    </div>
  );
}
