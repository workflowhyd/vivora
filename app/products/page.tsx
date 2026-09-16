import { Suspense } from "react";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCatalogue } from "@/components/products/ProductCatalogue";

export const metadata: Metadata = {
  title: "Products | Vivora Foods",
  description:
    "Browse Vivora Foods' full catalogue of dehydrated vegetables, fruits, powders, ready-to-cook and ready-to-fry products — export-grade quality from India.",
};

export default function ProductsPage() {
  return (
    <>
      <Header />
      <main className="pt-28 md:pt-36 pb-24 md:pb-32 bg-cream min-h-screen">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10">
          <div className="max-w-2xl mb-10 md:mb-14">
            <span className="label-caps text-[12px] text-blue">Our Range</span>
            <h1 className="font-display text-4xl md:text-6xl leading-[1.05] mt-4 text-blue-dark">
              The full <span className="italic text-blue">catalogue.</span>
            </h1>
          </div>
          <Suspense fallback={<div className="py-16 text-center text-charcoal/50">Loading products…</div>}>
            <ProductCatalogue />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
