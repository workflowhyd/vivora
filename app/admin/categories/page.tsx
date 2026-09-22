"use client";

import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Id, Doc } from "@/convex/_generated/dataModel";
import { childrenOf, topLevel } from "@/lib/categoryTree";

// Flattens the tree into rows in display order (parent immediately followed
// by its children), each carrying its depth for indentation.
function flattenTree(categories: Doc<"categories">[]): { category: Doc<"categories">; depth: number }[] {
  const rows: { category: Doc<"categories">; depth: number }[] = [];
  const walk = (parents: Doc<"categories">[], depth: number) => {
    for (const category of parents) {
      rows.push({ category, depth });
      walk(childrenOf(categories, category._id), depth + 1);
    }
  };
  walk(topLevel(categories), 0);
  return rows;
}

export default function AdminCategoriesPage() {
  const categories = useQuery(api.categories.list, { activeOnly: false });
  const removeCategory = useMutation(api.categories.remove);

  const handleDelete = async (id: Id<"categories">, name: string) => {
    if (!confirm(`Delete "${name}"? This can't be undone.`)) return;
    try {
      await removeCategory({ id });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not delete category.");
    }
  };

  const rows = categories ? flattenTree(categories) : [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Categories</h1>
          <p className="text-charcoal/60 mt-1">
            The category tree shown on the public site. A category with sub-categories becomes a
            browsing page instead of a product list.
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center gap-2 bg-green text-cream-light text-sm font-medium px-4 py-2.5 rounded-md hover:bg-green-dark transition-colors duration-200"
        >
          <Plus size={16} />
          New category
        </Link>
      </div>

      <div className="mt-8 bg-white border border-charcoal/10 rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-charcoal/10 text-left text-charcoal/50">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Order</th>
              <th className="px-5 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {rows.map(({ category, depth }) => (
              <tr key={category._id} className="border-b border-charcoal/5 last:border-0">
                <td className="px-5 py-3.5" style={{ paddingLeft: `${20 + depth * 24}px` }}>
                  {depth > 0 && <span className="text-charcoal/30 mr-2">└</span>}
                  {category.name}
                </td>
                <td className="px-5 py-3.5 text-charcoal/60">
                  {category.active ? "Active" : "Inactive"}
                </td>
                <td className="px-5 py-3.5 text-charcoal/60">{category.sortOrder}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/categories/${category._id}/edit`}
                      aria-label={`Edit ${category.name}`}
                      className="text-charcoal/50 hover:text-blue"
                    >
                      <Pencil size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(category._id, category.name)}
                      aria-label={`Delete ${category.name}`}
                      className="text-charcoal/50 hover:text-crimson"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {categories?.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-charcoal/50">
                  No categories yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
