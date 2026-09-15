"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";

const fieldClasses =
  "w-full border border-charcoal/15 rounded-md px-3.5 py-2.5 text-sm focus:outline-none focus:border-forest transition-colors duration-200";

// Optional list-style fields are edited as one-item-per-line text areas and
// parsed back into string[] on submit — a structured editor is Stage 2 work.
function linesToArray(value: FormDataEntryValue | null): string[] | undefined {
  const lines = String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  return lines.length > 0 ? lines : undefined;
}

export function ProductForm({ product }: { product?: Doc<"products"> }) {
  const router = useRouter();
  const categories = useQuery(api.categories.list, { activeOnly: false });
  const createProduct = useMutation(api.products.create);
  const updateProduct = useMutation(api.products.update);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const images = linesToArray(form.get("images")) ?? [];
    const fields = {
      name: String(form.get("name")),
      slug: String(form.get("slug")),
      categoryId: String(form.get("categoryId")) as Id<"categories">,
      shortDescription: String(form.get("shortDescription")),
      description: String(form.get("description")),
      thumbnail: String(form.get("thumbnail")),
      images,
      ingredients: linesToArray(form.get("ingredients")),
      benefits: linesToArray(form.get("benefits")),
      applications: linesToArray(form.get("applications")),
      packSizes: linesToArray(form.get("packSizes")),
      shelfLife: form.get("shelfLife") ? String(form.get("shelfLife")) : undefined,
      storage: form.get("storage") ? String(form.get("storage")) : undefined,
      moq: form.get("moq") ? String(form.get("moq")) : undefined,
      featured: form.get("featured") === "on",
      active: form.get("active") === "on",
      sortOrder: Number(form.get("sortOrder")),
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
          <label className="text-sm font-medium" htmlFor="categoryId">
            Category
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={product?.categoryId}
            className={`${fieldClasses} mt-1.5`}
          >
            {categories?.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="sortOrder">
            Sort order
          </label>
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            required
            defaultValue={product?.sortOrder ?? 0}
            className={`${fieldClasses} mt-1.5`}
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium" htmlFor="shortDescription">
          Short description
        </label>
        <input
          id="shortDescription"
          name="shortDescription"
          required
          defaultValue={product?.shortDescription}
          placeholder="One line shown on product cards"
          className={`${fieldClasses} mt-1.5`}
        />
      </div>

      <div>
        <label className="text-sm font-medium" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          defaultValue={product?.description}
          className={`${fieldClasses} mt-1.5 resize-none`}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="text-sm font-medium" htmlFor="thumbnail">
            Thumbnail image URL
          </label>
          <input
            id="thumbnail"
            name="thumbnail"
            type="url"
            required
            defaultValue={product?.thumbnail}
            className={`${fieldClasses} mt-1.5`}
          />
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="images">
            Gallery image URLs (one per line)
          </label>
          <textarea
            id="images"
            name="images"
            rows={3}
            defaultValue={product?.images?.join("\n")}
            className={`${fieldClasses} mt-1.5 resize-none`}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        <div>
          <label className="text-sm font-medium" htmlFor="shelfLife">
            Shelf life
          </label>
          <input
            id="shelfLife"
            name="shelfLife"
            defaultValue={product?.shelfLife}
            className={`${fieldClasses} mt-1.5`}
          />
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="storage">
            Storage
          </label>
          <input
            id="storage"
            name="storage"
            defaultValue={product?.storage}
            className={`${fieldClasses} mt-1.5`}
          />
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="moq">
            MOQ
          </label>
          <input
            id="moq"
            name="moq"
            defaultValue={product?.moq}
            className={`${fieldClasses} mt-1.5`}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="text-sm font-medium" htmlFor="ingredients">
            Ingredients (one per line)
          </label>
          <textarea
            id="ingredients"
            name="ingredients"
            rows={3}
            defaultValue={product?.ingredients?.join("\n")}
            className={`${fieldClasses} mt-1.5 resize-none`}
          />
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="benefits">
            Benefits (one per line)
          </label>
          <textarea
            id="benefits"
            name="benefits"
            rows={3}
            defaultValue={product?.benefits?.join("\n")}
            className={`${fieldClasses} mt-1.5 resize-none`}
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium" htmlFor="applications">
          Applications (one per line)
        </label>
        <textarea
          id="applications"
          name="applications"
          rows={2}
          defaultValue={product?.applications?.join("\n")}
          className={`${fieldClasses} mt-1.5 resize-none`}
        />
      </div>

      <div>
        <label className="text-sm font-medium" htmlFor="packSizes">
          Pack sizes (one per line)
        </label>
        <textarea
          id="packSizes"
          name="packSizes"
          rows={2}
          defaultValue={product?.packSizes?.join("\n")}
          className={`${fieldClasses} mt-1.5 resize-none`}
        />
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" name="featured" defaultChecked={product?.featured ?? false} />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" name="active" defaultChecked={product?.active ?? true} />
          Active
        </label>
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
