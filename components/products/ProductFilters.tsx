"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterCategory {
  slug: string;
  name: string;
}

export type SortOption = "default" | "name-asc" | "newest";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "default", label: "Our order" },
  { value: "name-asc", label: "Name (A–Z)" },
  { value: "newest", label: "Newest" },
];

export function ProductFilters({
  categories,
  activeCategory,
  search,
  sort,
  onCategoryChange,
  onSearchChange,
  onSortChange,
}: {
  categories: FilterCategory[];
  activeCategory: string | null;
  search: string;
  sort: SortOption;
  onCategoryChange: (slug: string | null) => void;
  onSearchChange: (value: string) => void;
  onSortChange: (value: SortOption) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products…"
            className="w-full rounded-full border border-charcoal/15 bg-cream pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue transition-colors duration-200"
          />
        </div>

        <div className="flex items-center gap-4 sm:ml-auto">
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="rounded-full border border-charcoal/15 bg-cream px-4 py-2.5 text-sm focus:outline-none focus:border-blue transition-colors duration-200"
            aria-label="Sort products"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={() => onCategoryChange(null)}
          className={cn(
            "label-caps text-[11px] px-4 py-2 rounded-full border transition-colors duration-200",
            activeCategory === null
              ? "bg-green text-cream-light border-green"
              : "border-charcoal/15 text-charcoal/70 hover:border-green/40"
          )}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.slug}
            type="button"
            onClick={() => onCategoryChange(category.slug)}
            className={cn(
              "label-caps text-[11px] px-4 py-2 rounded-full border transition-colors duration-200",
              activeCategory === category.slug
                ? "bg-green text-cream-light border-green"
                : "border-charcoal/15 text-charcoal/70 hover:border-green/40"
            )}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
