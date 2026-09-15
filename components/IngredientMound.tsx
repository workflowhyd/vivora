function lighten(hex: string, amount: number) {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0x00ff) + amount);
  const b = Math.min(255, (num & 0x0000ff) + amount);
  return `rgb(${r}, ${g}, ${b})`;
}

function darken(hex: string, amount: number) {
  return lighten(hex, -amount);
}

export function IngredientMound({
  color,
  className,
}: {
  color: string;
  className?: string;
}) {
  const gradientId = `mound-${color.replace("#", "")}`;
  const noiseId = `noise-${color.replace("#", "")}`;

  return (
    <svg
      viewBox="0 0 200 140"
      className={className}
      role="img"
      aria-label="Stylised mound of dried fruit"
    >
      <defs>
        <radialGradient id={gradientId} cx="42%" cy="30%" r="75%">
          <stop offset="0%" stopColor={lighten(color, 55)} />
          <stop offset="45%" stopColor={color} />
          <stop offset="100%" stopColor={darken(color, 35)} />
        </radialGradient>
        <filter id={noiseId}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="noise" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0" />
        </filter>
      </defs>
      <path
        d="M100 8 C130 8 148 30 158 58 C170 90 168 118 150 128 C120 138 80 138 50 128 C32 118 30 90 42 58 C52 30 70 8 100 8 Z"
        fill={`url(#${gradientId})`}
      />
      <path
        d="M100 8 C130 8 148 30 158 58 C170 90 168 118 150 128 C120 138 80 138 50 128 C32 118 30 90 42 58 C52 30 70 8 100 8 Z"
        filter={`url(#${noiseId})`}
        opacity={0.35}
        style={{ mixBlendMode: "overlay" }}
      />
    </svg>
  );
}
