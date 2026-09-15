import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { BrandIntro } from "@/components/BrandIntro";
import { ProductCategories } from "@/components/ProductCategories";
import { ProductShowcase } from "@/components/ProductShowcase";
import { ColorSpectrum } from "@/components/ColorSpectrum";
import { FeaturedProduct } from "@/components/FeaturedProduct";
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
        <BrandIntro />
        <ProductCategories />
        <ProductShowcase />
        <ColorSpectrum />
        <FeaturedProduct />
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
