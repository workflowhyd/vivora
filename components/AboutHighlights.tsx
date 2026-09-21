"use client";

import { Reveal } from "./Reveal";
import { useContent } from "@/lib/useContent";

const rows = ["applications", "quality", "reach"] as const;

// Applications, Quality and Global Reach used to be pages of their own; each is
// now a single line under the About story.
export function AboutHighlights() {
  const { t } = useContent();

  return (
    <section className="bg-cream pb-16 md:pb-24">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <Reveal className="max-w-3xl border-t border-charcoal/10">
          <dl>
            {rows.map((row) => (
              <div
                key={row}
                className="grid gap-1 border-b border-charcoal/10 py-5 md:grid-cols-[11rem_1fr] md:items-baseline md:gap-8"
              >
                <dt className="label-caps text-[12px] text-gold">{t(`about.${row}.label`)}</dt>
                <dd className="font-light leading-relaxed text-charcoal/75">{t(`about.${row}.line`)}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
