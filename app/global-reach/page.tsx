import type { Metadata } from "next";
import { NavDock } from "@/components/NavDock";
import { Footer } from "@/components/Footer";
import { PageBlocks } from "@/components/PageBlocks";
import { GlobalReach } from "@/components/GlobalReach";

export const metadata: Metadata = {
  title: "Global Reach | Vivora Foods",
  description:
    "Vivora Foods exports dehydrated vegetables, fruits and powders from India to buyers and distributors worldwide.",
};

export default function GlobalReachPage() {
  return (
    <>
      <NavDock />
      <main>
        <GlobalReach />
        <PageBlocks page="global-reach" />
      </main>
      <Footer />
    </>
  );
}
