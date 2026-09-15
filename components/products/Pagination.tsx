import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

function getPageNumbers(page: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages = new Set<number>([1, totalPages, page, page - 1, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);

  const result: (number | "ellipsis")[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) result.push("ellipsis");
    result.push(p);
    prev = p;
  }
  return result;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1.5 mt-12 md:mt-16">
      <button
        type="button"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="h-9 w-9 rounded-full border border-charcoal/15 flex items-center justify-center text-charcoal/60 hover:border-forest/40 hover:text-forest disabled:opacity-30 disabled:pointer-events-none transition-colors duration-200"
      >
        <ChevronLeft size={16} />
      </button>

      {getPageNumbers(page, totalPages).map((p, i) =>
        p === "ellipsis" ? (
          <span key={`ellipsis-${i}`} className="px-1.5 text-charcoal/40 text-sm">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            aria-label={`Page ${p}`}
            aria-current={p === page ? "page" : undefined}
            onClick={() => onPageChange(p)}
            className={cn(
              "h-9 min-w-9 px-2.5 rounded-full text-sm transition-colors duration-200",
              p === page
                ? "bg-forest text-ivory"
                : "text-charcoal/70 hover:bg-forest/10"
            )}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        aria-label="Next page"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="h-9 w-9 rounded-full border border-charcoal/15 flex items-center justify-center text-charcoal/60 hover:border-forest/40 hover:text-forest disabled:opacity-30 disabled:pointer-events-none transition-colors duration-200"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
