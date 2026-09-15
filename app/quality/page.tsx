import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Quality } from "@/components/Quality";

export const metadata: Metadata = {
  title: "Quality | Vivora Foods",
  description:
    "Vivora Foods' quality standards — careful sourcing, rigorous grading, hygienic packing and export-ready documentation.",
};

export default function QualityPage() {
  return (
    <>
      <Header />
      <main className="pt-28 md:pt-36">
        <Quality />
      </main>
      <Footer />
    </>
  );
}
