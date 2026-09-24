import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Leaf } from "lucide-react";

export interface CategoryCardData {
  slug: string;
  name: string;
  description: string;
  image?: string;
}

export function CategoryCard({ category }: { category: CategoryCardData }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group block overflow-hidden rounded-md border border-charcoal/10 transition-colors duration-300 hover:border-green/40"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-cream-light">
        {category.image ? (
          <Image
            src={category.image}
            alt=""
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
          <h3 className="font-display text-lg md:text-xl text-blue-dark leading-snug">
            {category.name}
          </h3>
          <p className="text-charcoal/60 text-sm mt-1.5 font-light leading-relaxed line-clamp-2">
            {category.description}
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
