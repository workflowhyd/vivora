import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProductCategories } from "@/components/ProductCategories";
import { FeaturedProducts } from "@/components/products/FeaturedProducts";
import { Applications } from "@/components/Applications";
import { Process } from "@/components/Process";
import { Quality } from "@/components/Quality";
import { Statistics } from "@/components/Statistics";
import { GlobalReach } from "@/components/GlobalReach";
import { About } from "@/components/About";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ProductCategories />
        <FeaturedProducts />
        <Applications />
        <Process />
        <Quality />
        <Statistics />
        <GlobalReach />
        <About />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
