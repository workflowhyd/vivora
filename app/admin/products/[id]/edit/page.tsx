"use client";

import { use } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ProductForm } from "../../ProductForm";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = useQuery(api.products.get, { id: id as Id<"products"> });

  if (product === undefined) return null;
  if (product === null) return <p className="text-charcoal/60">Product not found.</p>;

  return (
    <div>
      <h1 className="font-display text-3xl">Edit product</h1>
      <ProductForm product={product} />
    </div>
  );
}
