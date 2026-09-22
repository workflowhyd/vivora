import { Suspense, cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import { fetchCachedQuery } from "@/lib/convexServer";
import { api } from "@/convex/_generated/api";
import { NavDock } from "@/components/NavDock";
import { Footer } from "@/components/Footer";
import { CategoryProductGrid } from "@/components/products/CategoryProductGrid";
import { CategoryChildren } from "@/components/products/CategoryChildren";
import { ancestorsOf, childrenOf } from "@/lib/categoryTree";

export const revalidate = 3600;

const getCategory = cache((slug: string) => fetchCachedQuery(api.categories.getBySlug, { slug }));
const getCategories = cache(() => fetchCachedQuery(api.categories.list, { activeOnly: true }));

export async function generateStaticParams() {
  const categories = await getCategories();
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
  const [category, categories] = await Promise.all([getCategory(slug), getCategories()]);
  if (!category) notFound();

  const ancestors = ancestorsOf(categories, category._id);
  const children = childrenOf(categories, category._id);
  const isGroup = children.length > 0;

  const products = isGroup
    ? []
    : await fetchCachedQuery(api.products.listCards, { categoryId: category._id });

  return (
    <>
      <NavDock />
      <main className="pt-12 md:pt-20 pb-24 md:pb-32 bg-cream min-h-screen">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10">
          {ancestors.length > 0 && (
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 mb-6 text-sm text-charcoal/50">
              <Link href="/products" className="hover:text-green transition-colors duration-200">
                Products
              </Link>
              {ancestors.map((a) => (
                <span key={a._id} className="flex items-center gap-1.5">
                  <ChevronRight size={13} />
                  <Link href={`/categories/${a.slug}`} className="hover:text-green transition-colors duration-200">
                    {a.name}
                  </Link>
                </span>
              ))}
              <ChevronRight size={13} />
              <span className="text-charcoal/70">{category.name}</span>
            </nav>
          )}

          <div className="max-w-2xl mb-10 md:mb-14">
            <span className="label-caps text-[12px] text-green">
              {isGroup ? "Browse" : "Category"}
            </span>
            <h1 className="font-display text-4xl md:text-6xl leading-[1.05] mt-4 text-blue-dark">
              {category.name}
            </h1>
            <p className="text-charcoal/70 font-light leading-relaxed mt-5 max-w-lg">
              {category.description}
            </p>
          </div>

          {isGroup ? (
            <CategoryChildren parentId={category._id} initial={children} />
          ) : (
            <Suspense fallback={<div className="py-16 text-center text-charcoal/50">Loading products…</div>}>
              <CategoryProductGrid categoryId={category._id} initialProducts={products} />
            </Suspense>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
