import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageBlocks } from "@/components/PageBlocks";
import { Applications } from "@/components/Applications";

export const metadata: Metadata = {
  title: "Applications | Vivora Foods",
  description:
    "See how Vivora Foods' dehydrated vegetables, fruits, powders and ready-to-cook products are used across gifting, retail, bakery and HoReCa.",
};

export default function ApplicationsPage() {
  return (
    <>
      <Header />
      <main className="pt-28 md:pt-36">
        <Applications />
        <PageBlocks page="applications" />
      </main>
      <Footer />
    </>
  );
}
