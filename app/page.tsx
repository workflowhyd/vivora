import { NavDock } from "@/components/NavDock";
import { Hero } from "@/components/Hero";
import { ProductCategories } from "@/components/ProductCategories";
import { FeaturedProducts } from "@/components/products/FeaturedProducts";
import { Statistics } from "@/components/Statistics";
import { ExploreLinks } from "@/components/ExploreLinks";
import { ContactBanner } from "@/components/ContactBanner";
import { Footer } from "@/components/Footer";
import { PageBlocks } from "@/components/PageBlocks";

export default function Home() {
  return (
    <>
      <NavDock />
      <main>
        <Hero />
        <ProductCategories />
        <FeaturedProducts />
        <Statistics />
        <ExploreLinks />
        <PageBlocks page="home" />
        <ContactBanner />
      </main>
      <Footer />
    </>
  );
}
