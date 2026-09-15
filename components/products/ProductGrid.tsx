import type { ReactNode } from "react";
import { ProductCard, type ProductCardData } from "./ProductCard";

export function ProductGrid({
  products,
  emptyState,
}: {
  products: ProductCardData[];
  emptyState?: ReactNode;
}) {
  if (products.length === 0) {
    return (
      <div className="py-16 text-center text-charcoal/50">
        {emptyState ?? "No products found."}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10 md:gap-x-8 md:gap-y-12">
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}
