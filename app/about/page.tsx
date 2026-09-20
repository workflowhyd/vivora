import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageBlocks } from "@/components/PageBlocks";
import { About } from "@/components/About";
import { Statistics } from "@/components/Statistics";

export const metadata: Metadata = {
  title: "About Us | Vivora Foods",
  description:
    "Vivora Foods sources, dehydrates and packs vegetables, fruits and powders from India for B2B buyers, distributors and retailers worldwide.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="pt-28 md:pt-36">
        <About />
        <Statistics />
        <PageBlocks page="about" />
      </main>
      <Footer />
    </>
  );
}
