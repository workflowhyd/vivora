import type { Metadata } from "next";
import { NavDock } from "@/components/NavDock";
import { Footer } from "@/components/Footer";
import { PageBlocks } from "@/components/PageBlocks";
import { About } from "@/components/About";
import { AboutHighlights } from "@/components/AboutHighlights";
import { AboutCertifications } from "@/components/AboutCertifications";
import { Statistics } from "@/components/Statistics";

export const metadata: Metadata = {
  title: "About Us | Vivora Foods",
  description:
    "Vivora Foods sources, dehydrates and packs vegetables, fruits and powders from India for B2B buyers, distributors and retailers worldwide.",
};

export default function AboutPage() {
  return (
    <>
      <NavDock />
      <main>
        <About />
        <AboutHighlights />
        <AboutCertifications />
        <Statistics />
        <PageBlocks page="about" />
      </main>
      <Footer />
    </>
  );
}
