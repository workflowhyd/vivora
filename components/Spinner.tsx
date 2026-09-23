import { cn } from "@/lib/utils";

// A small inline loading spinner — inherits `currentColor`, so it matches
// whatever text color it's dropped into (a button, an error message, etc).
export function Spinner({ className }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent",
        className
      )}
    />
  );
}
