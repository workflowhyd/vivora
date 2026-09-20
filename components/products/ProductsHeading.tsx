"use client";

import { useContent } from "@/lib/useContent";

export function ProductsHeading() {
  const { t } = useContent();
  return (
    <div className="max-w-2xl mb-10 md:mb-14">
      <span className="label-caps text-[12px] text-blue">{t("products.eyebrow")}</span>
      <h1 className="font-display text-4xl md:text-6xl leading-[1.05] mt-4 text-blue-dark">
        {t("products.titleMain")} <span className="italic text-blue">{t("products.titleAccent")}</span>
      </h1>
    </div>
  );
}
