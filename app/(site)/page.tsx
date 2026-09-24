import { NavDock } from "@/components/NavDock";
import { Hero } from "@/components/Hero";
import { ProductCategories } from "@/components/ProductCategories";
import { ProductSlider } from "@/components/ProductSlider";
import { ProductShowcase } from "@/components/ProductShowcase";
import { Statistics } from "@/components/Statistics";
import { ExploreLinks } from "@/components/ExploreLinks";
import { ContactBanner } from "@/components/ContactBanner";
import { Footer } from "@/components/Footer";
import { PageBlocks } from "@/components/PageBlocks";
import { api } from "@/convex/_generated/api";
import { fetchCachedQuery } from "@/lib/convexServer";

export default async function Home() {
  const [categories, products] = await Promise.all([
    fetchCachedQuery(api.categories.list, { activeOnly: true }),
    fetchCachedQuery(api.products.listCards, {}),
  ]);

  return (
    <>
      <NavDock />
      <main>
        <Hero />
        <ProductCategories initial={categories} />
        <ProductSlider initial={products} />
        <ProductShowcase />
        <Statistics />
        <ExploreLinks />
        <PageBlocks page="home" />
        <ContactBanner />
      </main>
      <Footer />
    </>
  );
}
