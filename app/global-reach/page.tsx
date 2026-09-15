import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GlobalReach } from "@/components/GlobalReach";

export const metadata: Metadata = {
  title: "Global Reach | Vivora Foods",
  description:
    "Vivora Foods exports dehydrated vegetables, fruits and powders from India to buyers and distributors worldwide.",
};

export default function GlobalReachPage() {
  return (
    <>
      <Header />
      <main className="pt-28 md:pt-36">
        <GlobalReach />
      </main>
      <Footer />
    </>
  );
}
