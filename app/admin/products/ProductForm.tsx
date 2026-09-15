"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

const CATEGORIES = ["Nuts & Kernels", "Dried Fruits", "Snacking Mixes"] as const;

const fieldClasses =
  "w-full border border-charcoal/15 rounded-md px-3.5 py-2.5 text-sm focus:outline-none focus:border-forest transition-colors duration-200";

export function ProductForm({ product }: { product?: Doc<"products"> }) {
  const router = useRouter();
  const createProduct = useMutation(api.products.create);
  const updateProduct = useMutation(api.products.update);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const fields = {
      slug: String(form.get("slug")),
      name: String(form.get("name")),
      category: String(form.get("category")) as (typeof CATEGORIES)[number],
      description: String(form.get("description")),
      image: String(form.get("image")),
      accentColor: String(form.get("accentColor")),
      order: Number(form.get("order")),
    };
    try {
      if (product) {
        await updateProduct({ id: product._id, ...fields });
      } else {
        await createProduct(fields);
      }
      router.push("/admin/products");
    } catch {
      setError("Something went wrong — please check the fields and try again.");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl flex flex-col gap-5 mt-8">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="text-sm font-medium" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            defaultValue={product?.name}
            className={`${fieldClasses} mt-1.5`}
          />
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="slug">
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            required
            defaultValue={product?.slug}
            className={`${fieldClasses} mt-1.5`}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="text-sm font-medium" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue={product?.category ?? CATEGORIES[0]}
            className={`${fieldClasses} mt-1.5`}
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="order">
            Sort order
          </label>
          <input
            id="order"
            name="order"
            type="number"
            required
            defaultValue={product?.order ?? 0}
            className={`${fieldClasses} mt-1.5`}
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={3}
          defaultValue={product?.description}
          className={`${fieldClasses} mt-1.5 resize-none`}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="text-sm font-medium" htmlFor="image">
            Image URL
          </label>
          <input
            id="image"
            name="image"
            type="url"
            required
            defaultValue={product?.image}
            className={`${fieldClasses} mt-1.5`}
          />
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="accentColor">
            Accent colour (hex)
          </label>
          <input
            id="accentColor"
            name="accentColor"
            required
            defaultValue={product?.accentColor ?? "#8A6A3C"}
            className={`${fieldClasses} mt-1.5`}
          />
        </div>
      </div>

      {error && <p className="text-crimson text-sm">{error}</p>}

      <div className="flex items-center gap-3 mt-2">
        <button
          type="submit"
          disabled={submitting}
          className="bg-forest text-ivory text-sm font-medium px-5 py-2.5 rounded-md hover:bg-near-black transition-colors duration-200 disabled:opacity-60"
        >
          {submitting ? "Saving…" : product ? "Save changes" : "Create product"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="text-charcoal/60 text-sm hover:text-charcoal"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
