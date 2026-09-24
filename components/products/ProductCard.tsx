import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Leaf } from "lucide-react";

export interface ProductCardData {
  slug: string;
  name: string;
  shortDescription: string;
  categoryName?: string;
  thumbnail?: string;
}

export function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-md border border-charcoal/10 transition-colors duration-300 hover:border-green/40"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-cream-light">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.name}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 400px"
            className="object-contain transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Leaf size={28} strokeWidth={1.25} className="text-green/25" />
          </div>
        )}
      </div>

      <div className="flex items-start justify-between gap-3 p-5">
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
