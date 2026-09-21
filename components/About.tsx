"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { useContent } from "@/lib/useContent";

export function About() {
  const { t } = useContent();
  return (
    <section id="about" className="bg-cream py-16 md:py-24">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 grid md:grid-cols-12 gap-10 md:gap-8 items-center">
        <div className="md:col-span-9 lg:col-span-7">
          <Reveal>
            <span className="label-caps text-[12px] text-blue">{t("about.eyebrow")}</span>
            <h2 className="font-display text-3xl md:text-4xl leading-[1.1] mt-4 text-blue-dark">
              {t("about.titleMain")}
              <br />
              <span className="italic text-green">{t("about.titleAccent")}</span>
            </h2>
            <p className="text-charcoal/70 font-light leading-relaxed mt-5 max-w-lg">
              {t("about.body")}
            </p>
            <Link
              href="/processing"
              className="group inline-flex items-center gap-2 mt-6 text-[13px] label-caps text-blue border-b-2 border-gold pb-1 hover:text-gold transition-colors duration-300"
            >
              {t("about.link")}
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

      </div>
    </section>
  );
}
