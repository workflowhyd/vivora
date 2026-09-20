import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export interface CategoryCardData {
  slug: string;
  name: string;
  description: string;
}

export function CategoryCard({ category }: { category: CategoryCardData }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group block rounded-md overflow-hidden border border-charcoal/10 hover:border-green/40 transition-colors duration-300"
    >
      <div className="p-5 flex items-start justify-between gap-3">
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
