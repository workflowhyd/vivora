import { NavDock } from "@/components/NavDock";
import { Hero } from "@/components/Hero";
import { ProductCategories } from "@/components/ProductCategories";
import { FeaturedProducts } from "@/components/products/FeaturedProducts";
import { Statistics } from "@/components/Statistics";
import { ExploreLinks } from "@/components/ExploreLinks";
import { ContactBanner } from "@/components/ContactBanner";
import { Footer } from "@/components/Footer";
import { PageBlocks } from "@/components/PageBlocks";
import { api } from "@/convex/_generated/api";
import { fetchCachedQuery } from "@/lib/convexServer";

export default async function Home() {
  const [categories, featured] = await Promise.all([
    fetchCachedQuery(api.categories.list, { activeOnly: true }),
    fetchCachedQuery(api.products.listCards, { featured: true }),
  ]);

  return (
    <>
      <NavDock />
      <main>
        <Hero />
        <ProductCategories initial={categories} />
        <FeaturedProducts initialProducts={featured} initialCategories={categories} />
        <Statistics />
        <ExploreLinks />
        <PageBlocks page="home" />
        <ContactBanner />
      </main>
      <Footer />
    </>
  );
}
