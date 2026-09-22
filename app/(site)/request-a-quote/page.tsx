import type { Metadata } from "next";
import { NavDock } from "@/components/NavDock";
import { Footer } from "@/components/Footer";
import { PageBlocks } from "@/components/PageBlocks";
import { CTA } from "@/components/CTA";

export const metadata: Metadata = {
  title: "Request a Quote | Vivora Foods",
  description:
    "Request a quote from Vivora Foods for dehydrated vegetables, fruits, powders and ready-to-cook products — our team will get back to you with pricing, samples and lead times.",
};

export default function RequestQuotePage() {
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
