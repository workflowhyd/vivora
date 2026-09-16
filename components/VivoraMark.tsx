export function VivoraMark({
  variant = "color",
  className,
}: {
  /** "color" renders the full navy/gold/green mark for light backgrounds.
   * "mono" renders a single-tone mark (currentColor) for dark or busy
   * backgrounds where the full palette would lose contrast. */
  variant?: "color" | "mono";
  className?: string;
}) {
  const navy = variant === "color" ? "#123b73" : "currentColor";
  const gold = variant === "color" ? "#b88a2a" : "currentColor";
  const leaf = variant === "color" ? "#176b3a" : "currentColor";
  const leafDark = variant === "color" ? "#0d4b2a" : "currentColor";

  return (
    <svg viewBox="0 0 120 132" className={className} role="img" aria-label="Vivora Foods mark">
      <path
        d="M18 20 L58 112 L100 20"
        stroke={gold}
        strokeWidth="20"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M18 20 L58 112 L100 20"
        stroke={navy}
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      <g transform="translate(58 4)">
        <path
          d="M0 26 C -4 12 2 -2 16 -10 C 18 4 14 20 0 26 Z"
          fill={leaf}
        />
        <path d="M0 26 C -2 16 1 4 8 -4" stroke={leafDark} strokeWidth="1.4" fill="none" opacity="0.5" />
      </g>
      <g transform="translate(50 8)">
        <path
          d="M0 24 C -10 14 -12 0 -4 -12 C 6 -4 8 12 0 24 Z"
          fill={leafDark}
        />
        <path d="M0 24 C -4 14 -4 2 -1 -6" stroke={leaf} strokeWidth="1.2" fill="none" opacity="0.5" />
      </g>
      <g transform="translate(38 16)">
        <path
          d="M0 18 C -8 10 -8 0 -1 -8 C 5 -2 6 10 0 18 Z"
          fill={leaf}
        />
      </g>
    </svg>
  );
}
