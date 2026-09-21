"use client";

import { useMemo } from "react";
import { useQuery } from "convex/react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { ProductGrid } from "./ProductGrid";
import { Pagination } from "./Pagination";
import type { ProductCards } from "@/lib/types";

const PAGE_SIZE = 12;

export function CategoryProductGrid({
  categoryId,
  initialProducts,
}: {
  categoryId: Id<"categories">;
  initialProducts: ProductCards;
}) {
  const products = useQuery(api.products.listCards, { categoryId }) ?? initialProducts;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(products.length / PAGE_SIZE)),
    [products]
  );
  const currentPage = Math.min(page, totalPages);
  const paged = useMemo(
    () => products.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
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

  return (
    <div>
      <ProductGrid
        products={paged.map((p) => ({
          slug: p.slug,
          name: p.name,
          shortDescription: p.shortDescription,
        }))}
        emptyState="No products in this category yet."
      />
      <Pagination page={currentPage} totalPages={totalPages} onPageChange={goToPage} />
    </div>
  );
}
