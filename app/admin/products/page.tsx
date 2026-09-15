"use client";

import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export default function AdminProductsPage() {
  const products = useQuery(api.products.listAdmin);
  const removeProduct = useMutation(api.products.remove);

  const handleDelete = async (id: Id<"products">, name: string) => {
    if (!confirm(`Delete "${name}"? This can't be undone.`)) return;
    await removeProduct({ id });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Products</h1>
          <p className="text-charcoal/60 mt-1">The catalogue shown on the public site.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-forest text-ivory text-sm font-medium px-4 py-2.5 rounded-md hover:bg-near-black transition-colors duration-200"
        >
          <Plus size={16} />
          New product
        </Link>
      </div>

      <div className="mt-8 bg-white border border-charcoal/10 rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-charcoal/10 text-left text-charcoal/50">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Order</th>
              <th className="px-5 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <tr key={product._id} className="border-b border-charcoal/5 last:border-0">
                <td className="px-5 py-3.5">
                  {product.name}
                  {product.featured && (
                    <span className="ml-2 label-caps text-[9px] text-yellow bg-forest rounded-full px-2 py-0.5">
                      Featured
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-charcoal/60">{product.categoryName}</td>
                <td className="px-5 py-3.5 text-charcoal/60">
                  {product.active ? "Active" : "Inactive"}
                </td>
                <td className="px-5 py-3.5 text-charcoal/60">{product.sortOrder}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/products/${product._id}/edit`}
                      aria-label={`Edit ${product.name}`}
                      className="text-charcoal/50 hover:text-forest"
                    >
                      <Pencil size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id, product.name)}
                      aria-label={`Delete ${product.name}`}
                      className="text-charcoal/50 hover:text-crimson"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-charcoal/50">
                  No products yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
