"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function AdminDashboardPage() {
  const products = useQuery(api.products.list);
  const categories = useQuery(api.categories.list);
  const inquiries = useQuery(api.inquiries.list);

  const newInquiries = inquiries?.filter((inquiry) => inquiry.status === "new").length;

  const cards = [
    { label: "Products", value: products?.length, href: "/admin/products" },
    { label: "Categories", value: categories?.length, href: "/admin/categories" },
    { label: "New inquiries", value: newInquiries, href: "/admin/inquiries" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl">Dashboard</h1>
      <p className="text-charcoal/60 mt-1">Overview of your catalogue and incoming leads.</p>

      <div className="grid sm:grid-cols-3 gap-5 mt-8">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white border border-charcoal/10 rounded-md p-6 hover:border-forest/30 transition-colors duration-200"
          >
            <p className="label-caps text-[11px] text-charcoal/50">{card.label}</p>
            <p className="font-display text-4xl mt-3">
              {card.value === undefined ? "—" : card.value}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
