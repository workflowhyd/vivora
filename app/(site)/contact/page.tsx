import type { Metadata } from "next";
import { NavDock } from "@/components/NavDock";
import { Footer } from "@/components/Footer";
import { PageBlocks } from "@/components/PageBlocks";
import { CTA } from "@/components/CTA";

export const metadata: Metadata = {
  title: "Contact Us | Vivora Foods",
  description:
    "Request a quote from Vivora Foods for dehydrated vegetables, fruits, powders and ready-to-cook products.",
};

export default function ContactPage() {
  return (
    <>
      <NavDock />
      <main>
        <CTA />
        <PageBlocks page="contact" />
      </main>
      <Footer />
    </>
  );
}
