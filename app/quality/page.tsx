import type { Metadata } from "next";
import { NavDock } from "@/components/NavDock";
import { Footer } from "@/components/Footer";
import { PageBlocks } from "@/components/PageBlocks";
import { Quality } from "@/components/Quality";

export const metadata: Metadata = {
  title: "Quality | Vivora Foods",
  description:
    "Vivora Foods' quality standards — careful sourcing, rigorous grading, hygienic packing and export-ready documentation.",
};

export default function QualityPage() {
  return (
    <>
      <NavDock />
      <main>
        <Quality />
        <PageBlocks page="quality" />
      </main>
      <Footer />
    </>
  );
}
