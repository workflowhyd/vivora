import { cn } from "@/lib/utils";
import { VivoraMark } from "./VivoraMark";

export function Logo({
  variant = "light",
  className,
}: {
  variant?: "light" | "dark";
  className?: string;
}) {
  const nameColor = variant === "light" ? "text-cream-light" : "text-blue";
  const foodsColor = "text-gold";
  const tagColor = variant === "light" ? "text-cream-light/60" : "text-blue/55";
  const iconVariant = variant === "light" ? "mono" : "color";
  const iconColor = variant === "light" ? "text-cream-light" : undefined;

  return (
    <div className={cn("flex items-center gap-2.5 leading-none select-none", className)}>
      <VivoraMark variant={iconVariant} className={cn("h-8 w-8 md:h-9 md:w-9 shrink-0", iconColor)} />
      <div className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-xl md:text-2xl font-semibold tracking-tight",
            nameColor
          )}
        >
          Vivora <span className={cn("text-[0.62em] label-caps align-middle", foodsColor)}>Foods</span>
        </span>
        <span
          className={cn(
            "label-caps text-[8px] md:text-[9px] mt-1 tracking-[0.22em]",
            tagColor
          )}
        >
          Dry Delicious · Nature Goodness
        </span>
      </div>
    </div>
  );
}
