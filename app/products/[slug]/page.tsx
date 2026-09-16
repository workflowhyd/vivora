import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { ArrowRight, MessageCircle } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductGrid } from "@/components/products/ProductGrid";

export const revalidate = 3600;

async function getProduct(slug: string) {
  return fetchQuery(api.products.getBySlug, { slug });
}

export async function generateStaticParams() {
  const products = await fetchQuery(api.products.list, { activeOnly: true });
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};

  const title = product.seoTitle || `${product.name} | Vivora Foods`;
  const description = product.seoDescription || product.shortDescription;

  return {
    title,
    description,
    keywords: product.seoKeywords,
    openGraph: {
      title,
      description,
      images: product.thumbnail ? [{ url: product.thumbnail }] : undefined,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const related = product.category
    ? (await fetchQuery(api.products.listByCategory, {
        categoryId: product.category._id,
        activeOnly: true,
      })).filter((p) => p.slug !== product.slug).slice(0, 4)
    : [];

  const whatsappMessage = encodeURIComponent(`Hi, I'm interested in ${product.name}.`);

  return (
    <>
      <Header />
      <main className="pt-28 md:pt-36 pb-24 md:pb-32 bg-cream min-h-screen">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10">
          {product.category && (
            <Link
              href={`/categories/${product.category.slug}`}
              className="label-caps text-[11px] text-green/70 hover:text-green"
            >
              {product.category.name}
            </Link>
          )}

          <div className="grid md:grid-cols-12 gap-10 md:gap-14 mt-4">
            <div className="md:col-span-6">
              <ProductGallery images={product.images} alt={product.name} />
            </div>

            <div className="md:col-span-6">
              <h1 className="font-display text-3xl md:text-5xl leading-[1.05] text-blue-dark">
                {product.name}
              </h1>
              <p className="text-charcoal/70 font-light leading-relaxed mt-5 max-w-lg">
                {product.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-8">
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 bg-green text-cream-light text-[13px] label-caps px-7 py-4 rounded-full hover:bg-green-dark transition-colors duration-300"
                >
                  Request Product Quote
                  <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <a
                  href={`https://wa.me/910000000000?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[13px] label-caps text-blue border border-blue/30 px-7 py-4 rounded-full hover:border-blue transition-colors duration-300"
                >
                  <MessageCircle size={15} />
                  Enquire on WhatsApp
                </a>
              </div>

              {(product.packSizes || product.shelfLife || product.storage || product.moq) && (
                <dl className="grid grid-cols-2 gap-x-6 gap-y-4 mt-10 pt-8 border-t border-charcoal/10">
                  {product.packSizes && (
                    <div>
                      <dt className="label-caps text-[10px] text-charcoal/50">Pack sizes</dt>
                      <dd className="text-sm text-blue-dark mt-1">{product.packSizes.join(", ")}</dd>
                    </div>
                  )}
                  {product.shelfLife && (
                    <div>
                      <dt className="label-caps text-[10px] text-charcoal/50">Shelf life</dt>
                      <dd className="text-sm text-blue-dark mt-1">{product.shelfLife}</dd>
                    </div>
                  )}
                  {product.storage && (
                    <div>
                      <dt className="label-caps text-[10px] text-charcoal/50">Storage</dt>
                      <dd className="text-sm text-blue-dark mt-1">{product.storage}</dd>
                    </div>
                  )}
                  {product.moq && (
                    <div>
                      <dt className="label-caps text-[10px] text-charcoal/50">MOQ</dt>
                      <dd className="text-sm text-blue-dark mt-1">{product.moq}</dd>
                    </div>
                  )}
                </dl>
              )}

              {product.benefits && product.benefits.length > 0 && (
                <div className="mt-8">
                  <h2 className="label-caps text-[11px] text-charcoal/50">Benefits</h2>
                  <ul className="mt-3 space-y-1.5">
                    {product.benefits.map((benefit) => (
                      <li key={benefit} className="text-sm text-blue-dark/80">
                        • {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product.applications && product.applications.length > 0 && (
                <div className="mt-6">
                  <h2 className="label-caps text-[11px] text-charcoal/50">Applications</h2>
                  <p className="text-sm text-blue-dark/80 mt-3">{product.applications.join(", ")}</p>
                </div>
              )}

              {product.ingredients && product.ingredients.length > 0 && (
                <div className="mt-6">
                  <h2 className="label-caps text-[11px] text-charcoal/50">Ingredients</h2>
                  <p className="text-sm text-blue-dark/80 mt-3">{product.ingredients.join(", ")}</p>
                </div>
              )}

              {product.specifications && product.specifications.length > 0 && (
                <div className="mt-6">
                  <h2 className="label-caps text-[11px] text-charcoal/50">Specifications</h2>
                  <dl className="mt-3 space-y-1.5">
                    {product.specifications.map((spec) => (
                      <div key={spec.label} className="flex gap-2 text-sm">
                        <dt className="text-charcoal/50">{spec.label}:</dt>
                        <dd className="text-blue-dark/80">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-20 md:mt-28 pt-14 border-t border-charcoal/10">
              <h2 className="font-display text-2xl md:text-3xl text-blue-dark mb-8">
                Related products
              </h2>
              <ProductGrid
                products={related.map((p) => ({
                  slug: p.slug,
                  name: p.name,
                  thumbnail: p.thumbnail,
                  shortDescription: p.shortDescription,
                }))}
              />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
