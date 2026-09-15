import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export interface ProductCardData {
  slug: string;
  name: string;
  thumbnail: string;
  shortDescription: string;
  categoryName?: string;
}

export function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-[2px] bg-charcoal/5">
        <Image
          src={product.thumbnail}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 48vw, (max-width: 1024px) 30vw, 22vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <span className="absolute inset-0 flex items-end justify-end p-3 opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          <span className="h-9 w-9 rounded-full bg-ivory flex items-center justify-center">
            <ArrowUpRight size={16} className="text-forest" />
          </span>
        </span>
      </div>
      <div className="mt-3.5">
        {product.categoryName && (
          <span className="label-caps text-[10px] text-forest/70">{product.categoryName}</span>
        )}
        <h3 className="font-display text-lg md:text-xl text-near-black mt-1 leading-snug">
          {product.name}
        </h3>
        <p className="text-charcoal/60 text-sm mt-1.5 font-light leading-relaxed line-clamp-2">
          {product.shortDescription}
        </p>
      </div>
    </Link>
  );
}
