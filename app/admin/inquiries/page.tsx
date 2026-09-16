"use client";

import { useMutation, useQuery } from "convex/react";
import { Trash2 } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = ["new", "contacted", "closed"] as const;

const statusStyles: Record<(typeof STATUS_OPTIONS)[number], string> = {
  new: "bg-crimson/10 text-crimson",
  contacted: "bg-gold/10 text-gold",
  closed: "bg-charcoal/10 text-charcoal/60",
};

export default function AdminInquiriesPage() {
  const inquiries = useQuery(api.inquiries.list);
  const updateStatus = useMutation(api.inquiries.updateStatus);
  const removeInquiry = useMutation(api.inquiries.remove);

  const handleDelete = async (id: Id<"inquiries">) => {
    if (!confirm("Delete this inquiry? This can't be undone.")) return;
    await removeInquiry({ id });
  };

  return (
    <div>
      <h1 className="font-display text-3xl">Inquiries</h1>
      <p className="text-charcoal/60 mt-1">Quote requests submitted through the site.</p>

      <div className="mt-8 flex flex-col gap-4">
        {inquiries?.map((inquiry) => (
          <div key={inquiry._id} className="bg-white border border-charcoal/10 rounded-md p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium">{inquiry.name}</p>
                <p className="text-charcoal/60 text-sm mt-0.5">
                  {inquiry.email}
                  {inquiry.phone ? ` · ${inquiry.phone}` : ""}
                </p>
                {inquiry.productInterest && (
                  <p className="label-caps text-[10px] text-blue/70 mt-2">
                    {inquiry.productInterest}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <select
                  value={inquiry.status}
                  onChange={(event) =>
                    updateStatus({
                      id: inquiry._id,
                      status: event.target.value as (typeof STATUS_OPTIONS)[number],
                    })
                  }
                  className={cn(
                    "text-xs font-medium rounded-full px-3 py-1.5 border-0 focus:outline-none",
                    statusStyles[inquiry.status]
                  )}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleDelete(inquiry._id)}
                  aria-label="Delete inquiry"
                  className="text-charcoal/40 hover:text-crimson"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="text-sm text-charcoal/75 mt-4 leading-relaxed">{inquiry.message}</p>
            <p className="text-charcoal/40 text-xs mt-3">
              {new Date(inquiry.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
        {inquiries?.length === 0 && (
          <p className="text-charcoal/50 text-center py-12">No inquiries yet.</p>
        )}
      </div>
    </div>
  );
}
