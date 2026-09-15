import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";

export function ContactBanner() {
  return (
    <section className="bg-forest py-16 md:py-20">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <Reveal>
          <h2 className="font-display text-2xl md:text-4xl leading-[1.1] text-ivory">
            Looking for reliable, export-grade supply?
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 bg-ivory text-forest text-[13px] label-caps px-7 py-4 rounded-full hover:bg-yellow transition-colors duration-300 shrink-0"
          >
            Request a Quote
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
