import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CategoryProductGrid } from "@/components/products/CategoryProductGrid";

export const revalidate = 3600;

async function getCategory(slug: string) {
  return fetchQuery(api.categories.getBySlug, { slug });
}

export async function generateStaticParams() {
  const categories = await fetchQuery(api.categories.list, { activeOnly: true });
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

  return (
    <>
      <Header />
      <main className="pt-28 md:pt-36 pb-24 md:pb-32 bg-offwhite min-h-screen">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10">
          <div className="max-w-2xl mb-10 md:mb-14">
            <span className="label-caps text-[12px] text-crimson">Category</span>
            <h1 className="font-display text-4xl md:text-6xl leading-[1.05] mt-4 text-near-black">
              {category.name}
            </h1>
            <p className="text-charcoal/70 font-light leading-relaxed mt-5 max-w-lg">
              {category.description}
            </p>
          </div>
          <CategoryProductGrid categoryId={category._id} />
        </div>
      </main>
      <Footer />
    </>
  );
}
