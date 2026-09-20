"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { contentSlots, pages } from "@/convex/lib/contentRegistry";

export default function AdminPagesPage() {
  const overrides = useQuery(api.content.getAll);

  return (
    <div>
      <h1 className="font-display text-3xl">Pages</h1>
      <p className="text-charcoal/60 mt-1">
        Edit the text, images and video on each page, or add extra blocks to it.
      </p>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-8">
        {pages.map((page) => {
          const slots = contentSlots.filter((s) => s.page === page.id);
          const edited = slots.filter((s) => overrides?.some((o) => o.key === s.key)).length;
          return (
            <Link
              key={page.id}
              href={`/admin/pages/${page.id}`}
              className="bg-white border border-charcoal/10 rounded-md p-6 hover:border-blue/30 transition-colors duration-200"
            >
              <p className="font-display text-2xl">{page.label}</p>
              <p className="text-sm text-charcoal/50 mt-1">{page.path}</p>
              <p className="text-sm text-charcoal/60 mt-4">
                {slots.length} editable field{slots.length === 1 ? "" : "s"}
                {overrides ? ` · ${edited} customised` : ""}
              </p>
              <a
                href={page.path}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-sm text-blue mt-2 hover:underline"
              >
                View page <ArrowUpRight size={13} />
              </a>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
