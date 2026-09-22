"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Layers } from "lucide-react";
import { flattenTree } from "@/lib/categoryTree";
import { cn } from "@/lib/utils";
import type { ActiveCategories } from "@/lib/types";

// A single dropdown for the whole category tree, so a visitor can jump
// straight to any level — a group ("Dehydrated Products"), a mid-level
// ("Vegetables") or a specific line ("Vegetable Powders") — without first
// landing on a category page and clicking through. Selecting a group still
// shows every product under it (ProductCatalogue matches the whole subtree).
export function CategoryDropdown({
  categories,
  activeSlug,
  onChange,
}: {
  categories: ActiveCategories;
  activeSlug: string | null;
  onChange: (slug: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const rows = flattenTree(categories);
  const active = categories.find((c) => c.slug === activeSlug);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const select = (slug: string | null) => {
    onChange(slug);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition-colors duration-200",
          active ? "border-green/40 bg-green/5 text-blue-dark" : "border-charcoal/15 bg-cream text-charcoal/70 hover:border-green/40"
        )}
      >
        <Layers size={15} className="shrink-0 text-green" />
        <span className="max-w-[14rem] truncate">{active ? active.name : "Browse all categories"}</span>
        <ChevronDown size={14} className={cn("shrink-0 transition-transform duration-200", open && "rotate-180")} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 top-[calc(100%+8px)] z-30 max-h-[70vh] w-72 overflow-y-auto rounded-md border border-charcoal/10 bg-cream-light py-2 shadow-[0_20px_50px_-15px_rgba(9,40,79,0.35)]"
        >
          <button
            type="button"
            role="option"
            aria-selected={activeSlug === null}
            onClick={() => select(null)}
            className={cn(
              "block w-full px-4 py-2 text-left text-sm transition-colors duration-150",
              activeSlug === null ? "bg-green/10 text-green font-medium" : "text-blue-dark hover:bg-charcoal/5"
            )}
          >
            All products
          </button>
          <div className="my-1.5 border-t border-charcoal/10" />
          {rows.map(({ category, depth }) => (
            <button
              key={category._id}
              type="button"
              role="option"
              aria-selected={activeSlug === category.slug}
              onClick={() => select(category.slug)}
              style={{ paddingLeft: `${16 + depth * 18}px` }}
              className={cn(
                "block w-full py-2 pr-4 text-left text-sm transition-colors duration-150",
                activeSlug === category.slug ? "bg-green/10 text-green font-medium" : "text-blue-dark hover:bg-charcoal/5"
              )}
            >
              {depth > 0 && <span className="text-charcoal/30 mr-1.5">└</span>}
              {category.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
