"use client";

import { ShieldCheck } from "lucide-react";
import { Reveal, RevealGroup, revealItem } from "./Reveal";
import { motion } from "motion/react";
import { useContent } from "@/lib/useContent";

const SLOTS = [1, 2, 3, 4, 5, 6];

// Certification cards, edited from /admin/pages/about. A card without a name
// is not shown; logo and certificate number are optional.
export function AboutCertifications() {
  const { t, media } = useContent();

  const certs = SLOTS.map((n) => ({
    n,
    name: t(`about.certs.${n}.name`).trim(),
    description: t(`about.certs.${n}.description`),
    number: t(`about.certs.${n}.number`).trim(),
    logo: media(`about.certs.${n}.logo`),
  })).filter((c) => c.name);

  if (certs.length === 0) return null;

  return (
    <section className="bg-cream-light py-16 md:py-24">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <Reveal className="max-w-2xl">
          <span className="label-caps text-[12px] text-blue">{t("about.certs.eyebrow")}</span>
          <h2 className="font-display mt-4 text-3xl leading-[1.1] text-blue-dark md:text-4xl">
            {t("about.certs.titleMain")}{" "}
            <span className="italic text-green">{t("about.certs.titleAccent")}</span>
          </h2>
        </Reveal>

        <RevealGroup className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:mt-14 md:gap-6">
          {certs.map((cert) => (
            <motion.div
              key={cert.n}
              variants={revealItem}
              className="flex flex-col rounded-md border border-charcoal/10 bg-white/60 p-6"
            >
              <div className="flex h-14 items-center">
                {cert.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cert.logo} alt={`${cert.name} logo`} className="max-h-14 w-auto object-contain" />
                ) : (
                  <ShieldCheck size={32} strokeWidth={1.25} className="text-green" />
                )}
              </div>
              <h3 className="font-display mt-5 text-2xl text-blue-dark">{cert.name}</h3>
              {cert.description && (
                <p className="mt-2 text-sm font-light leading-relaxed text-charcoal/70">{cert.description}</p>
              )}
              {cert.number && (
                <p className="label-caps mt-4 text-[10px] text-gold">No. {cert.number}</p>
              )}
            </motion.div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
