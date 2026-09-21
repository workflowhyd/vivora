import { Suspense } from "react";
import type { Metadata } from "next";
import { NavDock } from "@/components/NavDock";
import { Footer } from "@/components/Footer";
import { ProductsHeading } from "@/components/products/ProductsHeading";
import { PageBlocks } from "@/components/PageBlocks";
import { api } from "@/convex/_generated/api";
import { fetchCachedQuery } from "@/lib/convexServer";
import { ProductCatalogue } from "@/components/products/ProductCatalogue";

export const metadata: Metadata = {
  title: "Products | Vivora Foods",
  description:
    "Browse Vivora Foods' full catalogue of dehydrated vegetables, fruits, powders, ready-to-cook and ready-to-fry products — export-grade quality from India.",
};

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    fetchCachedQuery(api.products.listCards, {}),
    fetchCachedQuery(api.categories.list, { activeOnly: true }),
  ]);

  return (
    <>
      <NavDock />
      <main className="pt-12 md:pt-20 pb-24 md:pb-32 bg-cream min-h-screen">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10">
          <ProductsHeading />
          <Suspense fallback={<div className="py-16 text-center text-charcoal/50">Loading products…</div>}>
            <ProductCatalogue initialProducts={products} initialCategories={categories} />
          </Suspense>
        </div>
        <PageBlocks page="products" />
      </main>
      <Footer />
    </>
  );
}
