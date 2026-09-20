"use client";

import { useMemo } from "react";
import { useQuery } from "convex/react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { ProductGrid } from "./ProductGrid";
import { ProductFilters, type SortOption } from "./ProductFilters";
import { Pagination } from "./Pagination";

const PAGE_SIZE = 12;

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
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);

  const updateParams = (updates: Record<string, string | null>, resetPage = false) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    if (resetPage) params.delete("page");
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

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

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
        onCategoryChange={(slug) => updateParams({ category: slug }, true)}
        onSearchChange={(value) => updateParams({ q: value || null }, true)}
        onSortChange={(value) => updateParams({ sort: value === "featured" ? null : value }, true)}
        onFeaturedOnlyChange={(value) => updateParams({ featured: value ? "1" : null }, true)}
      />

      <p className="text-charcoal/50 text-sm mt-6 mb-6">
        {filtered.length} {filtered.length === 1 ? "product" : "products"}
      </p>

      <ProductGrid
        products={paged.map((p) => ({
          slug: p.slug,
          name: p.name,
          shortDescription: p.shortDescription,
          categoryName: categoryNameById.get(p.categoryId),
        }))}
        emptyState="No products match your filters — try clearing the search or category."
      />

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={(p) => updateParams({ page: p === 1 ? null : String(p) })}
      />
    </div>
  );
}
