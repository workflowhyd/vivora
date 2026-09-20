import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export interface ProductCardData {
  slug: string;
  name: string;
  shortDescription: string;
  categoryName?: string;
}

export function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block rounded-md border border-charcoal/10 hover:border-green/40 transition-colors duration-300"
    >
      <div className="p-5 flex items-start justify-between gap-3">
        <div>
          {product.categoryName && (
            <span className="label-caps text-[10px] text-green">{product.categoryName}</span>
          )}
          <h3 className="font-display text-lg md:text-xl text-blue-dark mt-1 leading-snug">
            {product.name}
          </h3>
          <p className="text-charcoal/60 text-sm mt-1.5 font-light leading-relaxed line-clamp-2">
            {product.shortDescription}
          </p>
        </div>
        <ArrowUpRight
          size={18}
          className="text-green shrink-0 mt-1 transition-transform duration-300 group-hover:rotate-45"
        />
      </div>
    </Link>
  );
}
