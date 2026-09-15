"use client";

import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export default function AdminCategoriesPage() {
  const categories = useQuery(api.categories.list);
  const removeCategory = useMutation(api.categories.remove);

  const handleDelete = async (id: Id<"categories">, title: string) => {
    if (!confirm(`Delete "${title}"? This can't be undone.`)) return;
    await removeCategory({ id });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Categories</h1>
          <p className="text-charcoal/60 mt-1">The category cards shown on the public site.</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center gap-2 bg-forest text-ivory text-sm font-medium px-4 py-2.5 rounded-md hover:bg-near-black transition-colors duration-200"
        >
          <Plus size={16} />
          New category
        </Link>
      </div>

      <div className="mt-8 bg-white border border-charcoal/10 rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-charcoal/10 text-left text-charcoal/50">
              <th className="px-5 py-3 font-medium">#</th>
              <th className="px-5 py-3 font-medium">Title</th>
              <th className="px-5 py-3 font-medium">Order</th>
              <th className="px-5 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {categories?.map((category) => (
              <tr key={category._id} className="border-b border-charcoal/5 last:border-0">
                <td className="px-5 py-3.5 text-charcoal/60">{category.number}</td>
                <td className="px-5 py-3.5">{category.title}</td>
                <td className="px-5 py-3.5 text-charcoal/60">{category.order}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/categories/${category._id}/edit`}
                      aria-label={`Edit ${category.title}`}
                      className="text-charcoal/50 hover:text-forest"
                    >
                      <Pencil size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(category._id, category.title)}
                      aria-label={`Delete ${category.title}`}
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
