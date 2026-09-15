"use client";

import { use } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { CategoryForm } from "../../CategoryForm";

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const category = useQuery(api.categories.get, { id: id as Id<"categories"> });

  if (category === undefined) return null;
  if (category === null) return <p className="text-charcoal/60">Category not found.</p>;

  return (
    <div>
      <h1 className="font-display text-3xl">Edit category</h1>
      <CategoryForm category={category} />
    </div>
  );
}
