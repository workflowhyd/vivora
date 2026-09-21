import { Suspense, cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchCachedQuery } from "@/lib/convexServer";
import { api } from "@/convex/_generated/api";
import { NavDock } from "@/components/NavDock";
import { Footer } from "@/components/Footer";
import { CategoryProductGrid } from "@/components/products/CategoryProductGrid";

export const revalidate = 3600;

const getCategory = cache((slug: string) => fetchCachedQuery(api.categories.getBySlug, { slug }));

export async function generateStaticParams() {
  const categories = await fetchCachedQuery(api.categories.list, { activeOnly: true });
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) return {};

  return {
    title: category.seoTitle || `${category.name} | Vivora Foods`,
    description: category.seoDescription || category.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();
  const products = await fetchCachedQuery(api.products.listCards, { categoryId: category._id });

  return (
    <>
      <NavDock />
      <main className="pt-12 md:pt-20 pb-24 md:pb-32 bg-cream min-h-screen">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10">
          <div className="max-w-2xl mb-10 md:mb-14">
            <span className="label-caps text-[12px] text-green">Category</span>
            <h1 className="font-display text-4xl md:text-6xl leading-[1.05] mt-4 text-blue-dark">
              {category.name}
            </h1>
            <p className="text-charcoal/70 font-light leading-relaxed mt-5 max-w-lg">
              {category.description}
            </p>
          </div>
          <Suspense fallback={<div className="py-16 text-center text-charcoal/50">Loading products…</div>}>
            <CategoryProductGrid categoryId={category._id} initialProducts={products} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
