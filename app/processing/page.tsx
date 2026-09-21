import type { Metadata } from "next";
import { NavDock } from "@/components/NavDock";
import { Footer } from "@/components/Footer";
import { PageBlocks } from "@/components/PageBlocks";
import { Process } from "@/components/Process";

export const metadata: Metadata = {
  title: "Processing | Vivora Foods",
  description:
    "From harvest to pack: how Vivora Foods cleans, sorts, dehydrates, grinds and packs vegetables, fruits and powders for export.",
};

export default function ProcessingPage() {
  return (
    <>
      <NavDock />
      <main>
        <Process />
        <PageBlocks page="processing" />
      </main>
      <Footer />
    </>
  );
}
