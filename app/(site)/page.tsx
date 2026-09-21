import { NavDock } from "@/components/NavDock";
import { Hero } from "@/components/Hero";
import { ProductCategories } from "@/components/ProductCategories";
import { Statistics } from "@/components/Statistics";
import { ExploreLinks } from "@/components/ExploreLinks";
import { ContactBanner } from "@/components/ContactBanner";
import { Footer } from "@/components/Footer";
import { PageBlocks } from "@/components/PageBlocks";
import { api } from "@/convex/_generated/api";
import { fetchCachedQuery } from "@/lib/convexServer";

export default async function Home() {
  const categories = await fetchCachedQuery(api.categories.list, { activeOnly: true });

  return (
    <>
      <NavDock />
      <main>
        <Hero />
        <ProductCategories initial={categories} />
        <Statistics />
        <ExploreLinks />
        <PageBlocks page="home" />
        <ContactBanner />
      </main>
      <Footer />
    </>
  );
}
