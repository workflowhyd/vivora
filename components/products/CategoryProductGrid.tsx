"use client";

import { useMemo } from "react";
import { useQuery } from "convex/react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { ProductGrid } from "./ProductGrid";
import { Pagination } from "./Pagination";

const PAGE_SIZE = 12;

export function CategoryProductGrid({ categoryId }: { categoryId: Id<"categories"> }) {
  const products = useQuery(api.products.listByCategory, { categoryId, activeOnly: true });
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((products?.length ?? 0) / PAGE_SIZE)),
    [products]
  );
  const currentPage = Math.min(page, totalPages);
  const paged = useMemo(
    () => (products ?? []).slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [products, currentPage]
  );

  const goToPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (p === 1) {
      params.delete("page");
    } else {
      params.set("page", String(p));
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  if (!products) {
    return <div className="py-16 text-center text-charcoal/50">Loading products…</div>;
  }

  return (
    <div>
      <ProductGrid
        products={paged.map((p) => ({
          slug: p.slug,
          name: p.name,
          thumbnail: p.thumbnail,
          shortDescription: p.shortDescription,
        }))}
        emptyState="No products in this category yet."
      />
      <Pagination page={currentPage} totalPages={totalPages} onPageChange={goToPage} />
    </div>
  );
}
