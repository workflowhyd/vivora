"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { descendantIdsOf } from "@/lib/categoryTree";

const fieldClasses =
  "w-full border border-charcoal/15 rounded-md px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue transition-colors duration-200";

export function CategoryForm({ category }: { category?: Doc<"categories"> }) {
  const router = useRouter();
  const allCategories = useQuery(api.categories.list, { activeOnly: false });
  const createCategory = useMutation(api.categories.create);
  const updateCategory = useMutation(api.categories.update);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // A category can't become its own parent, or the parent of one of its own
  // sub-categories (that would make the tree circular).
  const parentOptions = (allCategories ?? []).filter((c) => {
    if (!category) return true;
    if (c._id === category._id) return false;
    return !descendantIdsOf(allCategories ?? [], category._id).has(c._id);
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const parentValue = String(form.get("parentId") ?? "");
    const fields = {
      name: String(form.get("name")),
      slug: String(form.get("slug")),
      description: String(form.get("description")),
      image: String(form.get("image")),
      active: form.get("active") === "on",
      sortOrder: Number(form.get("sortOrder")),
      parentId: parentValue ? (parentValue as Id<"categories">) : undefined,
    };
    try {
      if (category) {
        await updateCategory({ id: category._id, ...fields });
      } else {
        await createCategory(fields);
      }
      router.push("/admin/categories");
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
            defaultValue={category?.name}
            className={`${fieldClasses} mt-1.5`}
          />
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
            defaultValue={category?.sortOrder ?? 0}
            className={`${fieldClasses} mt-1.5`}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="text-sm font-medium" htmlFor="slug">
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            required
            defaultValue={category?.slug}
            className={`${fieldClasses} mt-1.5`}
          />
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="parentId">
            Parent category
          </label>
          <select
            id="parentId"
            name="parentId"
            defaultValue={category?.parentId ?? ""}
            className={`${fieldClasses} mt-1.5`}
          >
            <option value="">None — top-level category</option>
            {parentOptions.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-charcoal/50 mt-1.5">
            A category with sub-categories shows them as a browsing page instead of products.
          </p>
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
          defaultValue={category?.description}
          className={`${fieldClasses} mt-1.5 resize-none`}
        />
      </div>

      <div>
        <label className="text-sm font-medium" htmlFor="image">
          Image URL
        </label>
        <input
          id="image"
          name="image"
          type="url"
          required
          defaultValue={category?.image}
          className={`${fieldClasses} mt-1.5`}
        />
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" name="active" defaultChecked={category?.active ?? true} />
        Active
      </label>

      {error && <p className="text-crimson text-sm">{error}</p>}

      <div className="flex items-center gap-3 mt-2">
        <button
          type="submit"
          disabled={submitting}
          className="bg-green text-cream-light text-sm font-medium px-5 py-2.5 rounded-md hover:bg-green-dark transition-colors duration-200 disabled:opacity-60"
        >
          {submitting ? "Saving…" : category ? "Save changes" : "Create category"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/categories")}
          className="text-charcoal/60 text-sm hover:text-charcoal"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
