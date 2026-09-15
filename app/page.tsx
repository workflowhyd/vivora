import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProductCategories } from "@/components/ProductCategories";
import { FeaturedProducts } from "@/components/products/FeaturedProducts";
import { Statistics } from "@/components/Statistics";
import { ExploreLinks } from "@/components/ExploreLinks";
import { ContactBanner } from "@/components/ContactBanner";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ProductCategories />
        <FeaturedProducts />
        <Statistics />
        <ExploreLinks />
        <ContactBanner />
      </main>
      <Footer />
    </>
  );
}
