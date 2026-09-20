"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { contentSlots, pages } from "@/convex/lib/contentRegistry";
import { SlotEditor } from "./SlotEditor";
import { BlocksEditor } from "./BlocksEditor";

export default function EditPageContent({ params }: { params: Promise<{ page: string }> }) {
  const { page: pageId } = use(params);
  const page = pages.find((p) => p.id === pageId);

  if (!page) return <p className="text-charcoal/60">Page not found.</p>;

  const slots = contentSlots.filter((s) => s.page === page.id);
  const groups = [...new Set(slots.map((s) => s.group))];

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/pages"
        className="inline-flex items-center gap-1.5 text-sm text-charcoal/60 hover:text-blue"
      >
        <ArrowLeft size={14} /> All pages
      </Link>
      <h1 className="font-display text-3xl mt-3">{page.label} page</h1>
      <p className="text-charcoal/60 mt-1">
        Changes go live as soon as you save.{" "}
        <a href={page.path} target="_blank" rel="noreferrer" className="text-blue hover:underline">
          Open page
        </a>
      </p>

      {slots.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-2xl">Page content</h2>
          <p className="text-sm text-charcoal/55 mt-1">
            Existing text and media on this page. “Reset” puts back the original.
          </p>
          <div className="flex flex-col gap-8 mt-6">
            {groups.map((group) => (
              <div key={group} className="bg-white border border-charcoal/10 rounded-md p-6">
                <h3 className="label-caps text-[11px] text-charcoal/50">{group}</h3>
                <div className="flex flex-col gap-6 mt-5">
                  {slots
                    .filter((s) => s.group === group)
                    .map((slot) => (
                      <SlotEditor key={slot.key} slot={slot} />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-14">
        <h2 className="font-display text-2xl">Extra blocks</h2>
        <p className="text-sm text-charcoal/55 mt-1">
          Add your own text, image or video sections. They appear at the bottom of the page, in
          the order shown here.
        </p>
        <BlocksEditor page={page.id} />
      </section>
    </div>
  );
}
