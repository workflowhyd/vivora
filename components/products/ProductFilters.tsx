"use client";

import { Search } from "lucide-react";
import { CategoryDropdown } from "./CategoryDropdown";
import type { ActiveCategories } from "@/lib/types";

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
  categories: ActiveCategories;
  activeCategory: string | null;
  search: string;
  sort: SortOption;
  onCategoryChange: (slug: string | null) => void;
  onSearchChange: (value: string) => void;
  onSortChange: (value: SortOption) => void;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:flex-wrap">
      <div className="relative flex-1 min-w-[220px] max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search products…"
          className="w-full rounded-full border border-charcoal/15 bg-cream pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue transition-colors duration-200"
        />
      </div>

      <CategoryDropdown categories={categories} activeSlug={activeCategory} onChange={onCategoryChange} />

      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className="rounded-full border border-charcoal/15 bg-cream px-4 py-2.5 text-sm focus:outline-none focus:border-blue transition-colors duration-200 sm:ml-auto"
        aria-label="Sort products"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
