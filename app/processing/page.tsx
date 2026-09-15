import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Process } from "@/components/Process";

export const metadata: Metadata = {
  title: "Processing | Vivora Foods",
  description:
    "From harvest to pack: how Vivora Foods cleans, sorts, dehydrates, grinds and packs vegetables, fruits and powders for export.",
};

export default function ProcessingPage() {
  return (
    <>
      <Header />
      <main className="pt-28 md:pt-36">
        <Process />
      </main>
      <Footer />
    </>
  );
}
